/**
 * Authentication Redux Slice
 *
 * Manages authentication state including user info, tokens, loading states, and errors.
 * Integrates with Firebase Auth and follows Redux Toolkit patterns.
 *
 * @packageDocumentation
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { UserRole, UserSettings } from '@/types/user';

/**
 * Authentication state interface
 */
export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

/**
 * Authenticated user data interface
 */
export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  role: UserRole;
  settings: UserSettings;
  parentEmail?: string;
}

/**
 * Login payload interface
 */
export interface LoginPayload {
  user: AuthUser;
  token: string;
}

/**
 * Initial authentication state
 */
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

/**
 * Authentication slice with reducers for managing auth state
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Sets loading state when auth operation starts
     */
    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },

    /**
     * Updates state with user data on successful login
     */
    loginSuccess(state, action: PayloadAction<LoginPayload>) {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },

    /**
     * Handles login failure and stores error message
     */
    loginFailure(state, action: PayloadAction<{ error: string }>) {
      state.isLoading = false;
      state.error = action.payload.error;
      state.isAuthenticated = false;
    },

    /**
     * Updates user profile information
     */
    updateProfile(state, action: PayloadAction<Partial<AuthUser>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    /**
     * Updates user settings
     */
    updateSettings(state, action: PayloadAction<UserSettings>) {
      if (state.user) {
        state.user.settings = action.payload;
      }
    },

    /**
     * Clears auth state on logout
     */
    logout(state) {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;
      state.isAuthenticated = false;
    },

    /**
     * Clears error state
     */
    clearError(state) {
      state.error = null;
    },

    /**
     * Updates auth state
     */
    updateAuthState(
      state,
      action: PayloadAction<{ user?: AuthUser | null; token?: string | null }>,
    ) {
      if ('user' in action.payload) {
        state.user = action.payload.user;
      }
      if ('token' in action.payload) {
        state.token = action.payload.token;
      }
    },
  },
});

// Export actions
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  updateProfile,
  updateSettings,
  logout,
  clearError,
  updateAuthState,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;

/**
 * Type guard to check if user is authenticated
 */
export const isAuthenticated = (
  state: AuthState,
): state is AuthState & { user: AuthUser } => {
  return state.isAuthenticated && state.user !== null;
};

/**
 * Type guard to check if user is parent
 */
export const isParent = (state: AuthState): boolean => {
  return state.user?.role === 'parent';
};

/**
 * Selector to get current user
 */
export const selectCurrentUser = (state: {
  auth: AuthState;
}): AuthUser | null => {
  return state.auth.user;
};

/**
 * Selector to get auth loading state
 */
export const selectAuthLoading = (state: { auth: AuthState }): boolean => {
  return state.auth.isLoading;
};

/**
 * Selector to get auth error
 */
export const selectAuthError = (state: { auth: AuthState }): string | null => {
  return state.auth.error;
};
