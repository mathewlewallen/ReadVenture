/**
 * Welcome Screen Component
 *
 * Initial landing screen that provides login and registration options.
 * Handles navigation to authentication flows and displays app branding.
 *
 * @packageDocumentation
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';

import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { NavigationProps } from '../../navigation';
import { clearAuthState } from '../../store/authSlice';
import { theme } from '../../theme';

type WelcomeScreenProps = NavigationProps<'Welcome'>;

/**
 * Welcome screen component
 * Displays app branding and authentication options
 */
const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    // Clear any existing auth state on mount
    dispatch(clearAuthState());

    // Check for existing session
    const checkSession = async () => {
      try {
        const session = await AsyncStorage.getItem('userSession');
        if (session && isAuthenticated) {
          navigation.replace('Home');
        }
      } catch (error) {
        console.error('Session check failed:', error);
      }
    };

    checkSession();

    return () => {
      // Cleanup any subscriptions/listeners
    };
  }, [dispatch, navigation, isAuthenticated]);

  return (
    <ErrorBoundary>
      <View style={styles.container} testID="welcome-screen">
        <Appbar.Header>
          <Appbar.Content
            title="Welcome to ReadVenture!"
            accessibilityRole="header"
          />
        </Appbar.Header>

        <View style={styles.content}>
          <FontAwesome
            name="book"
            size={80}
            color={theme.colors.primary}
            style={styles.icon}
            accessibilityLabel="ReadVenture logo"
          />

          <Text
            style={styles.welcomeText}
            accessibilityRole="text"
            accessibilityHint="Welcome message describing the app's purpose"
          >
            Welcome to ReadVenture, the app that helps children learn to read!
          </Text>

          <Button
            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
            icon={() => <FontAwesome name="sign-in" size={24} color="white" />}
            accessibilityLabel="Login button"
            accessibilityHint="Navigate to login screen"
            testID="login-button"
          >
            Login
          </Button>

          <Button
            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate('Registration')}
            icon={() => (
              <FontAwesome name="user-plus" size={24} color="white" />
            )}
            accessibilityLabel="Register button"
            accessibilityHint="Navigate to registration screen"
            testID="register-button"
          >
            Register
          </Button>
        </View>
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    marginVertical: 10,
    paddingVertical: 8,
    width: '80%',
  },
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  welcomeText: {
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontWeight: '600',
      },
      android: {
        fontWeight: 'bold',
      },
    }),
  },
});

export default WelcomeScreen;
