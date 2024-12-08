/**
 * Welcome Screen Component
 *
 * Initial landing screen that provides login and registration options.
 * Handles navigation to authentication flows and displays app branding.
 *
 * @packageDocumentation
 */

import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { theme } from '../../theme';
import { NavigationProps } from '../../navigation';
import { clearAuthState } from '../../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    ...Platform.select({
      ios: {
        fontWeight: '600',
      },
      android: {
        fontWeight: 'bold',
      },
    }),
  },
  button: {
    width: '80%',
    marginVertical: 10,
    borderRadius: 8,
    paddingVertical: 8,
  },
});

export default WelcomeScreen;
