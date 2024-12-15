/**
 * Main Application Component
 *
 * Root component that handles:
 * - Navigation setup
 * - State management initialization
 * - Environment validation
 * - Error boundaries
 * - Authentication flow
 *
 * @packageDocumentation
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { Provider } from 'react-redux';

// Store & Services
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoginScreen from './screens/LoginScreen';
import ParentDashboardScreen from './screens/ParentDashboardScreen';
import ProgressScreen from './screens/ProgressScreen';
import ReadingScreen from './screens/ReadingScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import SettingsScreen from '@/screens/SettingScreen';
import StoryLibraryScreen from './screens/StoryLibraryScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import store from '@/store/slices/authSlice';
import { initializeAnalytics, logError } from './utils/analytics';
import validateEnv from './utils/validation/envValidation';

// Components

// Screens

// Types
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Registration: undefined;
  Home: undefined;
  StoryLibrary: undefined;
  Reading: { storyId: string };
  ParentDashboard: undefined;
  Progress: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Root application component
 * @returns React component
 */
const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isValidEnv, setIsValidEnv] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
  };

  // Handle error boundary errors
  const handleError = useCallback(
    (error: Error, errorInfo: React.ErrorInfo) => {
      logError('App Crash', { error, errorInfo });
      setError(error.message);
    },
    [],
  );

  // Reset error state
  const resetError = useCallback(() => {
    setError(null);
    setIsValidEnv(true);
    // Re-initialize if needed
    initialize().catch(console.error);
  }, []);

  // Initialize app
  const initialize = async () => {
    try {
      await validateEnv();
      setIsValidEnv(true);
      await initializeAnalytics();
    } catch (err) {
      console.error('Initialization failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      throw err; // Re-throw for error boundary
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initialize().catch(console.error);
    return () => {
      // Cleanup
    };
  }, []);

  // Custom error fallback UI
  const errorFallback = (
    <View style={styles.container}>
      <Text
        style={styles.errorText}
        accessibilityRole="alert"
        testID="error-message"
      >
        {error || 'An unexpected error occurred'}
      </Text>
    </View>
  );

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          accessibilityLabel="Loading application"
          testID="loading-indicator"
        />
      </View>
    );
  }

  // Environment validation errors
  if (!isValidEnv || error) {
    return errorFallback;
  }

  return (
    <ErrorBoundary
      onError={handleError}
      resetError={resetError}
      fallback={errorFallback}
    >
      <SafeAreaView style={[styles.container, backgroundStyle]}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" testID="loading-indicator" />
          </View>
        ) : !isValidEnv || error ? (
          errorFallback
        ) : (
          <Provider store={store}>
            <NavigationContainer
              fallback={<ActivityIndicator size="large" />}
              onStateChange={(state) => {
                // Track navigation state changes
                if (__DEV__) {
                  console.log('New Navigation State:', state);
                }
              }}
            >
              <Stack.Navigator
                initialRouteName="Welcome"
                screenOptions={{
                  headerShown: false,
                  animation: 'slide_from_right',
                  gestureEnabled: true,
                  animationTypeForReplace: 'push',
                }}
              >
                <Stack.Screen
                  name="Welcome"
                  component={WelcomeScreen}
                  options={{ title: 'Welcome' }}
                />
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{ title: 'Login' }}
                />
                <Stack.Screen
                  name="Registration"
                  component={RegistrationScreen}
                  options={{ title: 'Register' }}
                />
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{ title: 'Home' }}
                />
                <Stack.Screen
                  name="StoryLibrary"
                  component={StoryLibraryScreen}
                  options={{ title: 'Library' }}
                />
                <Stack.Screen
                  name="Reading"
                  component={ReadingScreen}
                  options={{ title: 'Reading' }}
                />
                <Stack.Screen
                  name="Progress"
                  component={ProgressScreen}
                  options={{ title: 'Progress' }}
                />
                <Stack.Screen
                  name="ParentDashboard"
                  component={ParentDashboardScreen}
                  options={{ title: 'Parent Dashboard' }}
                />
                <Stack.Screen
                  name="Settings"
                  component={SettingsScreen}
                  options={{ title: 'Settings' }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </Provider>
        )}
      </SafeAreaView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 16,
    padding: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
