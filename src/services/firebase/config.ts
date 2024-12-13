/**
 * Firebase Configuration and Services
 *
 * Handles Firebase initialization, service configuration, and API setup.
 * Implements proper error handling, type safety, and security best practices.
 *
 * @packageDocumentation
 */

import {
  getAnalytics,
  Analytics,
  setAnalyticsCollectionEnabled,
} from 'firebase/analytics';
import { initializeApp, FirebaseOptions, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import {
  Firestore,
  initializeFirestore,
} from 'firebase/firestore';
import Config from 'react-native-config';

import { logError } from '../utils/analytics';

/** Firebase services interface */
interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  analytics: Analytics;
}

/**
 * Validates Firebase configuration
 * @throws {Error} If required config fields are missing
 */
const validateFirebaseConfig = (
  config: Partial<FirebaseOptions>,
): config is FirebaseOptions => {
  const required: (keyof FirebaseOptions)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
    'measurementId',
  ];

  const missing = required.filter(key => !config[key]);
  if (missing.length > 0) {
    throw new Error(`Missing Firebase configuration: ${missing.join(', ')}`);
  }

  return true;
};

/**
 * Initializes Firebase services
 * @throws {Error} If initialization fails
 */
const initializeFirebase = (): FirebaseServices => {
  const firebaseConfig: Partial<FirebaseOptions> = {
    apiKey: Config.FIREBASE_API_KEY,
    authDomain: Config.FIREBASE_AUTH_DOMAIN,
    projectId: Config.FIREBASE_PROJECT_ID,
    storageBucket: Config.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: Config.FIREBASE_MESSAGING_SENDER_ID,
    appId: Config.FIREBASE_APP_ID,
    measurementId: Config.FIREBASE_MEASUREMENT_ID,
  };

  try {
    if (!validateFirebaseConfig(firebaseConfig)) {
      throw new Error('Invalid Firebase configuration');
    }

    // Initialize Firebase app
    const app = initializeApp(firebaseConfig);

    // Initialize Authentication with persistence
    const auth = getAuth(app);
    setPersistence(auth, browserLocalPersistence);

    // Initialize Firestore with settings
    const db = initializeFirestore(app, {
      cacheSizeBytes: 50 * 1024 * 1024, // 50MB cache
      ignoreUndefinedProperties: true,
      experimentalForceLongPolling: true, // For better mobile support
    });

    // Initialize Analytics
    const analytics = getAnalytics(app);
    setAnalyticsCollectionEnabled(analytics, !__DEV__);

    return { app, auth, db, analytics };
  } catch (error) {
    logError('Firebase initialization failed:', error);
    throw error;
  }
};

// Initialize services
let services: FirebaseServices;

try {
  services = initializeFirebase();
} catch (error) {
  logError('Firebase services initialization failed:', error);
  throw error;
}

// Export initialized services
export const { app, auth, db, analytics } = services;

// Export type definitions
export type { FirebaseServices };

/**
 * Cleanup function for Firebase services
 */
export const cleanup = async (): Promise<void> => {
  try {
    await Promise.all([auth.signOut(), app.delete()]);
  } catch (error) {
    logError('Firebase cleanup failed:', error);
    throw error;
  }
};

/**
 * API client with interceptors and error handling
 */
import axios, { AxiosInstance, AxiosError } from 'axios';

class ApiClient {
  private static instance: AxiosInstance;

  static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: Config.API_URL,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      // Add request interceptor
      this.instance.interceptors.request.use(
        config => {
          // Add auth token if available
          const token = auth.currentUser?.getIdToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        error => {
          logError('API request failed:', error);
          return Promise.reject(error);
        },
      );

      // Add response interceptor
      this.instance.interceptors.response.use(
        response => response,
        (error: AxiosError) => {
          this.handleApiError(error);
          return Promise.reject(error);
        },
      );
    }
    return this.instance;
  }

  private static handleApiError(error: AxiosError): void {
    if (error.response) {
      logError('API response error:', {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      logError('API request error:', error.request);
    } else {
      logError('API error:', error.message);
    }
  }
}

export const api = ApiClient.getInstance();
