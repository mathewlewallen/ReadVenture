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
export type UserRole = 'student' | 'parent' | 'admin';

/**
 * Theme preference type
 */
export type Theme = 'light' | 'dark' | 'system';

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
  /** Last login timestamp */
  lastLoginAt: FirebaseFirestore.Timestamp;
  /** Account creation timestamp */
  createdAt: FirebaseFirestore.Timestamp;
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
  /** Push notification settings */
  notifications: {
    enabled: boolean;
    dailyReminder: boolean;
    progressUpdates: boolean;
    achievements: boolean;
  };
  /** Accessibility settings */
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
    screenReader: boolean;
  };
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
  /** Earned badges/achievements */
  badges: Badge[];
  /** Most recent activity */
  lastActivity: FirebaseFirestore.Timestamp;
  /** Daily reading streaks */
  streak: {
    current: number;
    longest: number;
    lastReadAt: FirebaseFirestore.Timestamp;
  };
  /** Reading level progression */
  levelProgress: {
    current: number;
    next: number;
    percentage: number;
  };
}

/**
 * Achievement/badge data
 */
export interface Badge {
  /** Unique badge identifier */
  id: string;
  /** Badge display name */
  name: string;
  /** Badge description */
  description: string;
  /** Badge image URL */
  imageUrl: string;
  /** When the badge was earned */
  dateEarned: FirebaseFirestore.Timestamp;
}

/**
 * Reading session statistics
 */
export interface ReadingSession {
  /** Session identifier */
  id: string;
  /** Associated story ID */
  storyId: string;
  /** Session start time */
  startTime: FirebaseFirestore.Timestamp;
  /** Session duration in seconds */
  duration: number;
  /** Words read in session */
  wordsRead: number;
  /** Reading accuracy percentage */
  accuracy: number;
  /** Reading comprehension score */
  comprehensionScore?: number;
}

/**
 * Parent-specific data
 */
export interface ParentData extends User {
  /** Connected child accounts */
  children: {
    id: string;
    name: string;
    progress: UserProgress;
  }[];
  /** Parent-specific settings */
  parentalControls: {
    contentFiltering: boolean;
    timeRestrictions: {
      enabled: boolean;
      dailyLimit: number;
      allowedTimeRanges: Array<{
        start: string;
        end: string;
      }>;
    };
  };
}

export default User;
