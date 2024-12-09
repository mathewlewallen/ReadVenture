/**
 * User Types and Interfaces
 *
 * Central type definitions for user-related data structures.
 * Includes authentication, settings, and progress tracking.
 *
 * @packageDocumentation
 */

import { FirebaseFirestore } from '@firebase/firestore-types';

/**
 * User role types
 */
export type UserRole = 'student' | 'parent';

/**
 * Theme preference type
 */
export type Theme = 'light' | 'dark';

/**
 * Text size preference type
 */
export type TextSize = 'small' | 'medium' | 'large';

/**
 * Core user interface
 */
export interface User {
  /** Unique user identifier */
  id: string;
  /** User's email address */
  email: string;
  /** Display name for the user */
  displayName?: string;
  /** User's role in the system */
  role: UserRole;
  /** Parent's email if user is a student */
  parentEmail?: string;
  /** User preferences */
  settings: UserSettings;
  /** Reading progress data */
  progress: UserProgress;
  /** Account creation timestamp */
  createdAt: FirebaseFirestore.Timestamp;
  /** Last login timestamp */
  lastLoginAt: FirebaseFirestore.Timestamp;
}

/**
 * User preferences and settings
 */
export interface UserSettings {
  /** Reading level (1-12) */
  readingLevel: number;
  /** Sound effects toggle */
  soundEffectsEnabled: boolean;
  /** Text size preference */
  textSize: TextSize;
  /** Theme preference */
  theme: Theme;
  /** Last update timestamp */
  updatedAt?: FirebaseFirestore.Timestamp;
}

/**
 * User progress tracking
 */
export interface UserProgress {
  /** Total words read */
  totalWordsRead: number;
  /** Number of completed stories */
  storiesCompleted: number;
  /** Average reading accuracy */
  averageAccuracy: number;
  /** Earned badge IDs */
  badges: string[];
  /** Last activity timestamp */
  lastActivity?: FirebaseFirestore.Timestamp;
  /** Reading streak data */
  streak?: {
    current: number;
    longest: number;
    lastReadAt: FirebaseFirestore.Timestamp;
  };
}

/**
 * Default user settings
 */
export const DEFAULT_USER_SETTINGS: UserSettings = {
  readingLevel: 1,
  soundEffectsEnabled: true,
  textSize: 'medium',
  theme: 'light',
};

/**
 * Default user progress
 */
export const DEFAULT_USER_PROGRESS: UserProgress = {
  totalWordsRead: 0,
  storiesCompleted: 0,
  averageAccuracy: 0,
  badges: [],
};

/**
 * User validation utilities
 */
export const userValidation = {
  isValidEmail: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },
  isValidReadingLevel: (level: number): boolean => {
    return level >= 1 && level <= 12;
  },
};

export default User;
