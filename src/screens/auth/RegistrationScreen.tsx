/**
 * Registration Screen Component
 *
 * Handles new user registration with email/password and parent email validation.
 * Integrates with Firebase Auth and Redux for state management.
 *
 * @packageDocumentation
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Button, Appbar, TextInput } from 'react-native-paper';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { theme } from '../../theme';
import { NavigationProps } from '../../navigation';
import { logError } from '../../utils/analytics';
import { auth } from '../../services/firebase/config';

type RegistrationScreenProps = NavigationProps<'Registration'>;

interface RegistrationForm {
  email: string;
  password: string;
  parentEmail: string;
}

/**
 * Registration screen component for new user signup
 */
const RegistrationScreen: React.FC<RegistrationScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<RegistrationForm>({
    email: '',
    password: '',
    parentEmail: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Validates form fields
   */
  const validateForm = useCallback((): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email || !formData.password || !formData.parentEmail) {
      Alert.alert('Error', 'All fields are required');
      return false;
    }

    if (
      !emailRegex.test(formData.email) ||
      !emailRegex.test(formData.parentEmail)
    ) {
      Alert.alert('Error', 'Please enter valid email addresses');
      return false;
    }

    if (formData.password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return false;
    }

    return true;
  }, [formData]);

  /**
   * Handles user registration
   */
  const handleRegister = useCallback(async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      dispatch(loginStart());

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );

      const token = await userCredential.user.getIdToken();
      await AsyncStorage.setItem('token', token);

      dispatch(
        loginSuccess({
          user: userCredential.user,
          token,
        }),
      );

      navigation.replace('Home');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Registration failed';
      logError('Registration Error', error);
      dispatch(loginFailure(errorMessage));
      Alert.alert(
        'Registration Error',
        'Failed to create account. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [formData, dispatch, navigation, validateForm]);

  return (
    <ErrorBoundary>
      <View style={styles.container} testID="registration-screen">
        <Appbar.Header>
          <Appbar.BackAction
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
          />
          <Appbar.Content title="Create Account" />
        </Appbar.Header>

        <View style={styles.content}>
          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={text =>
              setFormData(prev => ({ ...prev, email: text }))
            }
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            accessibilityLabel="Email input"
            accessibilityHint="Enter your email address"
            testID="email-input"
          />

          <TextInput
            label="Password"
            value={formData.password}
            onChangeText={text =>
              setFormData(prev => ({ ...prev, password: text }))
            }
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

          <TextInput
            label="Parent Email"
            value={formData.parentEmail}
            onChangeText={text =>
              setFormData(prev => ({ ...prev, parentEmail: text }))
            }
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            accessibilityLabel="Parent email input"
            accessibilityHint="Enter your parent's email address"
            testID="parent-email-input"
          />

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
            icon={() => (
              <MaterialIcons
                name="person-add"
                size={24}
                color="white"
                accessibilityLabel="Register icon"
              />
            )}
            accessibilityLabel="Register button"
            accessibilityHint="Create new account"
            testID="register-button"
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.linkButton}
            accessibilityLabel="Login link"
            accessibilityHint="Navigate to login screen"
            testID="login-link"
          >
            Already have an account? Login
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

export default RegistrationScreen;
