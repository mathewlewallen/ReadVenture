/**
 * Custom hook for handling authentication state and operations
 * @packageDocumentation
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { authService } from '../services/firebase/auth.service';
import { setUser, clearUser } from '../store/authSlice';
import type {
  AuthUser,
  LoginCredentials,
  RegistrationData,
} from '../types/firebase.types';
import { logError } from '../utils/analytics';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegistrationData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

/**
 * Hook for managing authentication state and operations
 * @returns Authentication state and methods
 */
export const useAuth = (): AuthState & AuthActions => {
  const dispatch = useDispatch();
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  /**
   * Updates auth state and persists user data
   */
  const handleAuthStateChange = useCallback(
    async (user: AuthUser | null) => {
      try {
        if (user) {
          await AsyncStorage.setItem('user', JSON.stringify(user));
          dispatch(setUser(user));
        } else {
          await AsyncStorage.removeItem('user');
          dispatch(clearUser());
        }

        setState((prev) => ({
          ...prev,
          user,
          loading: false,
          error: null,
        }));
      } catch (error) {
        logError('Auth state update failed', error);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: 'Authentication state update failed',
        }));
      }
    },
    [dispatch],
  );

  /**
   * Initializes auth listener on mount
   */
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(handleAuthStateChange);

    return () => {
      unsubscribe();
    };
  }, [handleAuthStateChange]);

  /**
   * Handles user login
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      await authService.login(credentials);
    } catch (error) {
      logError('Login failed', error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Login failed. Please check your credentials.',
      }));
      throw error;
    }
  };

  /**
   * Handles user registration
   */
  const register = async (data: RegistrationData): Promise<void> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      await authService.register(data);
    } catch (error) {
      logError('Registration failed', error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Registration failed. Please try again.',
      }));
      throw error;
    }
  };

  /**
   * Handles user logout
   */
  const logout = async (): Promise<void> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      await authService.logout();
    } catch (error) {
      logError('Logout failed', error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Logout failed. Please try again.',
      }));
      throw error;
    }
  };

  /**
   * Handles password reset
   */
  const resetPassword = async (email: string): Promise<void> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      await authService.resetPassword(email);
    } catch (error) {
      logError('Password reset failed', error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Password reset failed. Please try again.',
      }));
      throw error;
    }
  };

  return {
    ...state,
    login,
    register,
    logout,
    resetPassword,
  };
};

export default useAuth;
