/**
 * Main Navigation Configuration
 *
 * Handles app-wide navigation setup, screen registration, and navigation options.
 * Integrates with Redux for auth state and deep linking for external navigation.
 *
 * @packageDocumentation
 */

import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';

import { ErrorBoundary } from '../components/common/ErrorBoundary';

// Screen Imports
import {
  HomeScreen,
  LoginScreen,
  ParentDashboardScreen,
  ProgressScreen,
  ReadingScreen,
  RegistrationScreen,
  SettingsScreen,
  SplashScreen,
  StoryLibraryScreen,
} from '../screens';
import { theme } from '../theme';

import { linking } from './linking';

// Types
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Registration: undefined;
  Home: undefined;
  StoryLibrary: undefined;
  Reading: { storyId: string };
  Progress: undefined;
  ParentDashboard: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Default screen configuration
 */
const defaultScreenOptions = {
  headerStyle: {
    backgroundColor: theme.colors.background,
  },
  headerTintColor: theme.colors.text,
  headerTitleStyle: {
    fontFamily: theme.fonts.medium,
    fontWeight: Platform.select({ ios: '600', android: 'bold' }),
  },
  animation: Platform.select({
    ios: 'default',
    android: 'slide_from_right',
  }),
  headerBackTitleVisible: false,
};

/**
 * Navigation theme configuration
 */
const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.background,
    primary: theme.colors.primary,
  },
};

/**
 * Main navigation component
 * Handles screen routing and navigation state
 */
const Navigation: React.FC = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    // Handle any navigation side effects (analytics, deep links)
    const unsubscribe = () => {
      // Cleanup navigation listeners
    };
    return unsubscribe;
  }, []);

  return (
    <ErrorBoundary>
      <NavigationContainer
        theme={navigationTheme}
        linking={linking}
        fallback={<SplashScreen />}
        documentTitle={{
          formatter: (options, route) =>
            `ReadVenture - ${options?.title ?? route?.name}`,
        }}
      >
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={defaultScreenOptions}
        >
          {!isAuthenticated ? (
            // Auth Stack
            <>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                  title: 'Login',
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Registration"
                component={RegistrationScreen}
                options={{
                  title: 'Register',
                  headerShown: false,
                }}
              />
            </>
          ) : (
            // Main App Stack
            <>
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
                options={{
                  title: 'Reading',
                  headerShown: false,
                }}
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
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
};

export default Navigation;
