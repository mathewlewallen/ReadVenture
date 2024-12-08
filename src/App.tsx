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

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Store & Services
import { store } from './store';
import { validateEnv } from './utils/validation/envValidation';
import { initializeAnalytics } from './utils/analytics';

// Components
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Screens
import {
  HomeScreen,
  LoginScreen,
  ParentDashboardScreen,
  ProgressScreen,
  ReadingScreen,
  RegistrationScreen,
  SettingsScreen,
  StoryLibraryScreen,
  WelcomeScreen,
} from './screens';

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

  useEffect(() => {
    const initialize = async () => {
      try {
        // Validate environment configuration
        await validateEnv();
        setIsValidEnv(true);

        // Initialize analytics
        await initializeAnalytics();
      } catch (err) {
        console.error('Initialization failed:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

    // Cleanup function
    return () => {
      // Cleanup analytics or other services
    };
  }, []);

  // Handle loading state
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

  // Handle environment validation errors
  if (!isValidEnv || error) {
    return (
      <View style={styles.container}>
        <Text
          style={styles.errorText}
          accessibilityRole="alert"
          testID="error-message"
        >
          {error || 'Environment configuration error'}
        </Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <NavigationContainer>
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
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});

export default App;
