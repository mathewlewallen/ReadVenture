/**
 * Analytics Utilities
 *
 * Handles analytics tracking, error logging, and performance monitoring.
 * Integrates with Firebase Analytics and custom backend services.
 *
 * @packageDocumentation
 */

import { Platform } from 'react-native';
import { Analytics, logEvent } from '@react-native-firebase/analytics';
import * as Sentry from '@sentry/react-native';
import { store } from '../store';
import { updateAnalytics } from '../store/analyticsSlice';
import type {
  AnalyticsEvent,
  ErrorReport,
  UserAction,
  PerformanceMetrics,
} from '../types';

/**
 * Analytics configuration interface
 */
interface AnalyticsConfig {
  enabled: boolean;
  userId?: string;
  sessionId: string;
  deviceInfo: {
    platform: string;
    version: string;
    brand: string;
  };
}

/**
 * Initializes analytics services
 */
export const initializeAnalytics = async (): Promise<void> => {
  try {
    await Analytics().setAnalyticsCollectionEnabled(!__DEV__);
    await setupErrorReporting();

    // Track app start
    logEvent('app_start', {
      timestamp: new Date().toISOString(),
      environment: __DEV__ ? 'development' : 'production',
    });
  } catch (error) {
    console.error('Analytics initialization failed:', error);
  }
};

/**
 * Logs error with context
 */
export const logError = (
  message: string,
  error: unknown,
  context?: Record<string, unknown>,
): void => {
  const errorReport: ErrorReport = {
    message,
    timestamp: new Date().toISOString(),
    userId: store.getState().auth.user?.id,
    deviceInfo: {
      platform: Platform.OS,
      version: Platform.Version,
      brand: Platform.select({ ios: 'Apple', android: 'Android' }),
    },
    context,
  };

  // Log to Firebase Analytics
  logEvent('error', errorReport);

  // Log to Sentry
  Sentry.captureException(error, {
    extra: errorReport,
  });

  // Update Redux store
  store.dispatch(updateAnalytics({ lastError: errorReport }));
};

/**
 * Tracks user actions
 */
export const trackUserAction = (
  action: UserAction,
  data?: Record<string, unknown>,
): void => {
  try {
    const eventData = {
      ...data,
      timestamp: new Date().toISOString(),
      userId: store.getState().auth.user?.id,
      sessionId: store.getState().analytics.sessionId,
    };

    logEvent(action, eventData);
    store.dispatch(
      updateAnalytics({ lastAction: { action, data: eventData } }),
    );
  } catch (error) {
    logError('Action tracking failed', error);
  }
};

/**
 * Tracks reading performance metrics
 */
export const trackReadingMetrics = async (
  metrics: PerformanceMetrics,
): Promise<void> => {
  try {
    const userId = store.getState().auth.user?.id;
    if (!userId) return;

    await Promise.all([
      // Log to Firebase
      logEvent('reading_metrics', {
        ...metrics,
        userId,
        timestamp: new Date().toISOString(),
      }),

      // Update backend
      fetch('/api/metrics', {
        method: 'POST',
        body: JSON.stringify({ userId, metrics }),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    ]);
  } catch (error) {
    logError('Metrics tracking failed', error);
  }
};

/**
 * Sets up error reporting service
 */
const setupErrorReporting = async (): Promise<void> => {
  if (!__DEV__) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.APP_ENV,
      enableAutoSessionTracking: true,
      attachStacktrace: true,
    });
  }
};

export default {
  initializeAnalytics,
  logError,
  trackUserAction,
  trackReadingMetrics,
};
