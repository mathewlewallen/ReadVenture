/**
 * Firebase Types
 *
 * Type definitions for Firebase-related data structures and operations.
 * Includes authentication, data models, and API responses.
 *
 * @packageDocumentation
 */

import { FirebaseFirestore } from '@firebase/firestore-types';

/**
 * Authenticated user data
 */
export interface AuthUser {
  /** Unique user identifier */
  uid: string;
  /** User's email address */
  email: string | null;
  /** User's display name */
  displayName: string | null;
  /** Whether user is a parent */
  isParent?: boolean;
  /** Timestamp of last login */
  lastLoginAt?: FirebaseFirestore.Timestamp;
  /** Account creation timestamp */
  createdAt: FirebaseFirestore.Timestamp;
}

/**
 * Login request credentials
 */
export interface LoginCredentials {
  /** User email */
  email: string;
  /** User password */
  password: string;
}

/**
 * Registration request data
 */
export interface RegistrationData extends LoginCredentials {
  /** User's display name */
  displayName: string;
  /** Whether registering as parent */
  isParent: boolean;
  /** Parent's email if registering child */
  parentEmail?: string;
}

/**
 * Story content and metadata
 */
export interface Story {
  /** Unique story identifier */
  id: string;
  /** Story title */
  title: string;
  /** Story content */
  content: string;
  /** Difficulty level (1-10) */
  difficulty: number;
  /** Target age range [min, max] */
  ageRange: [number, number];
  /** Creation timestamp */
  createdAt: FirebaseFirestore.Timestamp;
  /** Last update timestamp */
  updatedAt: FirebaseFirestore.Timestamp;
  /** Story category tags */
  tags?: string[];
  /** Estimated reading time (minutes) */
  readingTime?: number;
}

/**
 * Reading progress tracking
 */
export interface ReadingProgress {
  /** User identifier */
  userId: string;
  /** Story identifier */
  storyId: string;
  /** Number of words read */
  wordsRead: number;
  /** Reading accuracy (0-100) */
  accuracy: number;
  /** Completion timestamp */
  completedAt?: FirebaseFirestore.Timestamp;
  /** Reading session duration (seconds) */
  duration?: number;
  /** Current page/position */
  position?: number;
}

/**
 * Firebase error types
 */
export interface FirebaseError extends Error {
  /** Error code */
  code: string;
  /** Error details */
  details?: unknown;
}

/**
 * Firebase query options
 */
export interface QueryOptions {
  /** Maximum results to return */
  limit?: number;
  /** Results ordering */
  orderBy?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  /** Start after document */
  startAfter?: FirebaseFirestore.DocumentSnapshot;
}

/**
 * Firebase batch operation result
 */
export interface BatchResult {
  /** Success status */
  success: boolean;
  /** Number of operations */
  count: number;
  /** Failed operations */
  failures?: {
    index: number;
    error: FirebaseError;
  }[];
}

/**
 * Real-time update subscription
 */
export interface UpdateSubscription {
  /** Unsubscribe function */
  unsubscribe: () => void;
  /** Subscription status */
  active: boolean;
}

// Export type utilities
export type FirebaseDocument<T> = T & {
  id: string;
  ref: FirebaseFirestore.DocumentReference;
};

export type FirebaseCollection<T> = {
  [K in keyof T]: FirebaseDocument<T[K]>;
};
