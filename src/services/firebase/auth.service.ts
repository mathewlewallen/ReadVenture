// src/services/firebase/auth.service.ts
import { auth } from './config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  User,
  UserCredential,
} from 'firebase/auth';
import { AuthUser, LoginCredentials, RegistrationData } from '../../types/firebase.types';

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login({ email, password }: LoginCredentials): Promise<AuthUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return this.transformUser(userCredential.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register({ email, password, displayName, isParent }: RegistrationData): Promise<AuthUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await user.updateProfile({ displayName });
      await sendEmailVerification(user);

      return this.transformUser(user);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, (user) => {
      callback(user ? this.transformUser(user) : null);
    });
  }

  getCurrentUser(): AuthUser | null {
    const user = auth.currentUser;
    return user ? this.transformUser(user) : null;
  }

  private transformUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      emailVerified: user.emailVerified,
      createdAt: user.metadata.creationTime || '',
      lastLoginAt: user.metadata.lastSignInTime || '',
    };
  }
}

export default AuthService.getInstance();
