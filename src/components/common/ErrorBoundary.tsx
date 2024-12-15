/**
 * Error Boundary Component
 *
 * A React error boundary component that catches JavaScript errors anywhere in its
 * child component tree and displays a fallback UI instead of crashing the app.
 * Integrates with analytics and provides accessibility features.
 *
 * @packageDocumentation
 */

import * as Sentry from '@sentry/react-native';
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';

import theme from '@theme/theme';
import { logError } from '../../utils/analytics';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetError?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary class component
 * Catches JS errors and prevents app crashes
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Derives error state from error caught
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  /**
   * Handles error logging and reporting
   */
  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log to analytics
    logError('Error Boundary caught error', { error, errorInfo });

    // Report to error tracking
    Sentry.captureException(error);

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  /**
   * Resets error state
   */
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    this.props.resetError?.();
  };

  override render(): React.ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <View style={styles.container} accessibilityRole="alert">
          <Text style={styles.title}>Oops, something went wrong!</Text>
          <Text style={styles.message}>
            {error?.message || 'An unexpected error occurred'}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleReset}
            accessibilityRole="button"
            accessibilityLabel="Try again"
            accessibilityHint="Attempts to recover from the error"
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return children;
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  message: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    color: theme.colors.error,
    fontFamily: theme.fonts.medium,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

// Connect to Redux store if needed
export default ErrorBoundary;
