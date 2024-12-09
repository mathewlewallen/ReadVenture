/**
 * Reading Types and Interfaces
 *
 * Defines types for reading-related functionality including settings,
 * progress tracking, and statistics. Ensures type safety and proper
 * integration with the Redux store.
 *
 * @packageDocumentation
 */

import { FirebaseFirestore } from '@firebase/firestore-types';

/**
 * User reading preferences and settings
 */
export interface ReadingSettings {
  /** Font size in pixels (12-32) */
  fontSize: number;
  /** Words per minute (60-300) */
  readingSpeed: number;
  /** CSS color string for text highlighting */
  highlightColor: string;
  /** Enable/disable reading sound effects */
  soundEffectsEnabled: boolean;
}

/**
 * Reading progress for a specific story
 */
export interface ReadingProgress {
  /** Unique story identifier */
  storyId: string;
  /** Current word position in text */
  currentPosition: number;
  /** Total words successfully read */
  wordsRead: number;
  /** Reading accuracy percentage (0-100) */
  accuracy: number;
  /** Last update timestamp */
  timestamp: number;
  /** Session duration in seconds */
  duration?: number;
  /** Comprehension score if available */
  comprehensionScore?: number;
}

/**
 * Aggregate reading statistics
 */
export interface ReadingStats {
  /** Lifetime total words read */
  totalWordsRead: number;
  /** Average reading accuracy percentage */
  averageAccuracy: number;
  /** Average words per minute */
  readingSpeed: number;
  /** Number of completed stories */
  storiesCompleted: number;
  /** Last reading session timestamp */
  lastActivity?: FirebaseFirestore.Timestamp;
  /** Reading streak data */
  streak?: {
    current: number;
    longest: number;
    lastDate: FirebaseFirestore.Timestamp;
  };
}

/**
 * Reading session configuration
 */
export interface ReadingSessionConfig {
  /** Enable voice recognition */
  voiceEnabled: boolean;
  /** Auto-advance on correct word */
  autoAdvance: boolean;
  /** Minimum accuracy threshold */
  accuracyThreshold: number;
  /** Session timeout in minutes */
  timeoutMinutes: number;
}

/**
 * Reading analytics data
 */
export interface ReadingAnalytics {
  /** Session duration */
  duration: number;
  /** Words read per minute */
  wpm: number;
  /** Accuracy percentage */
  accuracy: number;
  /** Error patterns */
  errors: {
    word: string;
    attempts: number;
    corrections: number;
  }[];
  /** Achievement progress */
  achievements: {
    id: string;
    progress: number;
  }[];
}

/**
 * Reading state for Redux store
 */
export interface ReadingState {
  /** Current reading settings */
  settings: ReadingSettings;
  /** Active reading progress */
  progress: ReadingProgress | null;
  /** Aggregate statistics */
  stats: ReadingStats;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: string | null;
}

/**
 * Default reading settings
 */
export const DEFAULT_READING_SETTINGS: ReadingSettings = {
  fontSize: 18,
  readingSpeed: 120,
  highlightColor: '#FFD700',
  soundEffectsEnabled: true,
};

/**
 * Reading validation utilities
 */
export const readingValidation = {
  isValidFontSize: (size: number): boolean => size >= 12 && size <= 32,
  isValidSpeed: (speed: number): boolean => speed >= 60 && speed <= 300,
  isValidAccuracy: (accuracy: number): boolean =>
    accuracy >= 0 && accuracy <= 100,
};
