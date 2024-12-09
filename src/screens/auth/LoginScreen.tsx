/**
 * Login Screen Component
 *
 * Handles user authentication with email/password through Firebase.
 * Integrates with Redux for state management and provides error handling.
 *
 * @packageDocumentation
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Button, Appbar, TextInput } from 'react-native-paper';
import { NavigationProps } from '../navigation';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { theme } from '../theme';
import { logError } from '../utils/analytics';

type LoginScreenProps = NavigationProps<'Login'>;

/**
 * Login screen component for user authentication
 */
const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  /**
   * Validates form inputs
   */
  const validateForm = useCallback((): boolean => {
    if (!username || !password) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return false;
    }
    return true;
  }, [username, password]);

  /**
   * Handles user login attempt
   */
  const handleLogin = async (): Promise<void> => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      dispatch(loginStart());

      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password,
      );
      const user = userCredential.user;
      const token = await user.getIdToken();

      await AsyncStorage.setItem('token', token);
      dispatch(loginSuccess({ user, token }));
      navigation.navigate('Home');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Login failed';
      logError('Login Error', error);
      dispatch(loginFailure(errorMessage));
      Alert.alert('Login Error', 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <View style={styles.container} testID="login-screen">
        <Appbar.Header>
          <Appbar.BackAction
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
          />
          <Appbar.Content title="Login" />
        </Appbar.Header>

        <View style={styles.content}>
          <TextInput
            label="Email"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            accessibilityLabel="Email input"
            accessibilityHint="Enter your email address"
            testID="email-input"
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
                accessibilityLabel={
                  showPassword ? 'Hide password' : 'Show password'
                }
              />
            }
            style={styles.input}
            accessibilityLabel="Password input"
            accessibilityHint="Enter your password"
            testID="password-input"
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
            icon={() => (
              <MaterialIcons
                name="login"
                size={24}
                color="white"
                accessibilityLabel="Login icon"
              />
            )}
            accessibilityLabel="Login button"
            accessibilityHint="Press to login"
            testID="login-button"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Registration')}
            style={styles.linkButton}
            accessibilityLabel="Register button"
            accessibilityHint="Navigate to registration screen"
            testID="register-link"
          >
            Don't have an account? Register
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
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: 24,
    padding: 4,
    borderRadius: 8,
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
  linkButton: {
    marginTop: 16,
  },
});

export default LoginScreen;
