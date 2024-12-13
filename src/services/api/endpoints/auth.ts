/**
 * Authentication Service
 *
 * Handles all authentication-related API calls and integrates with Redux store.
 * Implements proper error handling, security measures, and type safety.
 *
 * @packageDocumentation
 */

import { AxiosError } from 'axios';

import { store } from '../../../store';
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  AuthError,
} from '../../../types';
import { logError } from '../../../utils/analytics';
import { encryptData } from '../../../utils/security';

import { api } from './client';

/**
 * Authentication endpoints and handlers
 */
export const authEndpoints = {
  /**
   * User login endpoint
   * @param credentials - User login credentials
   * @throws {AuthError} When login fails
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // Encrypt sensitive data before transmission
      const encryptedCredentials = {
        email: encryptData(credentials.email),
        password: encryptData(credentials.password),
      };

      const response = await api.post<AuthResponse>(
        '/auth/login',
        encryptedCredentials,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Client-Version': store.getState().app.version,
          },
        },
      );

      return response.data;
    } catch (error) {
      const authError = new AuthError(
        'Login failed',
        error instanceof AxiosError ? error.response?.status : 500,
      );
      logError('Auth.login failed:', error);
      throw authError;
    }
  },

  /**
   * User registration endpoint
   * @param credentials - New user registration data
   * @throws {AuthError} When registration fails
   */
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      // Encrypt sensitive data before transmission
      const encryptedCredentials = {
        email: encryptData(credentials.email),
        password: encryptData(credentials.password),
        parentEmail: encryptData(credentials.parentEmail),
      };

      const response = await api.post<AuthResponse>(
        '/auth/register',
        encryptedCredentials,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Client-Version': store.getState().app.version,
          },
        },
      );

      return response.data;
    } catch (error) {
      const authError = new AuthError(
        'Registration failed',
        error instanceof AxiosError ? error.response?.status : 500,
      );
      logError('Auth.register failed:', error);
      throw authError;
    }
  },

  /**
   * User logout endpoint
   * @throws {AuthError} When logout fails
   */
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout', null, {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`,
        },
      });
    } catch (error) {
      const authError = new AuthError(
        'Logout failed',
        error instanceof AxiosError ? error.response?.status : 500,
      );
      logError('Auth.logout failed:', error);
      throw authError;
    }
  },
};

/**
 * Helper function to validate credentials format
 */
export const validateCredentials = (
  credentials: LoginCredentials | RegisterCredentials,
): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!credentials.email || !credentials.password) {
    return false;
  }

  if (!emailRegex.test(credentials.email)) {
    return false;
  }

  if (credentials.password.length < 8) {
    return false;
  }

  if (
    'parentEmail' in credentials &&
    !emailRegex.test(credentials.parentEmail)
  ) {
    return false;
  }

  return true;
};

export default authEndpoints;
