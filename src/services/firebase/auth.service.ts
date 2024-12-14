/**
 * Authentication Service
 *
 * Handles all Firebase authentication operations including:
 * - User login/registration
 * - Password reset
 * - Email verification
 * - Session management
 *
 * @packageDocumentation
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  User,
} from 'firebase/auth';

import { store } from '../../store';
import { updateAuthState } from '../../store/authSlice';
import {
  AuthUser,
  LoginCredentials,
  RegistrationData,
} from '../../types/firebase.types';
import { logError } from '../../utils/analytics';

import { auth } from './config';

/**
 * Authentication service class using singleton pattern
 */
class AuthService {
  private static instance: AuthService;
  private unsubscribeAuth?: () => void;
  private tokenRefreshInterval?: NodeJS.Timeout;
  private readonly TOKEN_REFRESH_INTERVAL = 55 * 60 * 1000; // 55 minutes

  private constructor() {
    this.initAuthStateListener();
  }

  /**
   * Gets singleton instance
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Handles user login
   */
  public async login({ email, password }: LoginCredentials): Promise<AuthUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return this.transformUser(userCredential.user);
    } catch (error) {
      logError('Login failed:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Handles user registration
   */
  public async register({
    email,
    password,
    displayName,
  }: RegistrationData): Promise<AuthUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Set display name and send verification email
      await Promise.all([
        userCredential.user.updateProfile({ displayName }),
        sendEmailVerification(userCredential.user),
      ]);

      return this.transformUser(userCredential.user);
    } catch (error) {
      logError('Registration failed:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Handles user logout
   */
  public async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      logError('Logout failed:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sends password reset email
   */
  public async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      logError('Password reset failed:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Gets current Firebase ID token
   */
  public async getCurrentToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return null;
      }
      return await user.getIdToken();
    } catch (error) {
      logError('Token fetch failed:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Starts token refresh timer
   */
  private startTokenRefresh(): void {
    // Clear any existing interval
    this.stopTokenRefresh();

    // Set up new refresh interval
    this.tokenRefreshInterval = setInterval(async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken(true); // Force refresh
          store.dispatch(updateAuthState({ token }));
        }
      } catch (error) {
        logError('Token refresh failed:', error);
      }
    }, this.TOKEN_REFRESH_INTERVAL);
  }

  /**
   * Stops token refresh timer
   */
  private stopTokenRefresh(): void {
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
      this.tokenRefreshInterval = undefined;
    }
  }

  /**
   * Initializes auth state listener
   */
  private initAuthStateListener(): void {
    this.unsubscribeAuth = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          const transformedUser = this.transformUser(user);
          const token = await user.getIdToken();
          store.dispatch(updateAuthState({ user: transformedUser, token }));
          this.startTokenRefresh(); // Start token refresh when user logs in
        } else {
          store.dispatch(updateAuthState({ user: null, token: null }));
          this.stopTokenRefresh(); // Stop token refresh when user logs out
        }
      },
      (error) => {
        logError('Auth state change error:', error);
      },
    );
  }

  /**
   * Transforms Firebase user to app user
   */
  private transformUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
      createdAt: user.metadata.creationTime,
      lastLoginAt: user.metadata.lastSignInTime,
    };
  }

  /**
   * Handles authentication errors
   */
  private handleAuthError(error: unknown): Error {
    const authError = error as { code?: string; message: string };
    const errorMessage = this.getErrorMessage(authError.code);
    return new Error(errorMessage);
  }

  /**
   * Gets user-friendly error message
   */
  private getErrorMessage(code?: string): string {
    switch (code) {
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      default:
        return 'Authentication failed. Please try again.';
    }
  }

  /**
   * Cleanup auth listener and token refresh
   */
  public cleanup(): void {
    this.unsubscribeAuth?.();
    this.stopTokenRefresh();
  }
}

export const authService = AuthService.getInstance();
