/**
 * Main type definitions for ReadVenture application
 * @packageDocumentation
 */

import { FirebaseFirestore } from '@firebase/firestore-types';
import { NavigationProp, RouteProp } from '@react-navigation/native';

/**
 * User Authentication and Profile Types
 */
export interface User {
  id: string;
  email: string;
  displayName?: string;
  role: UserRole;
  parentEmail?: string;
  settings: UserSettings;
  progress: UserProgress;
}

export type UserRole = 'student' | 'parent';

export interface UserSettings {
  readingLevel: number;
  soundEffectsEnabled: boolean;
  textSize: TextSize;
  theme: Theme;
  notifications: boolean;
}

export type TextSize = 'small' | 'medium' | 'large';
export type Theme = 'light' | 'dark';

/**
 * Reading Progress and Analytics
 */
export interface UserProgress {
  totalWordsRead: number;
  storiesCompleted: number;
  averageAccuracy: number;
  badges: Badge[];
  lastActivity: FirebaseFirestore.Timestamp;
}

export interface ReadingSession {
  storyId: string;
  timestamp: FirebaseFirestore.Timestamp;
  wordsRead: number;
  accuracy: number;
  completionTime: number;
  difficulty: number;
}

/**
 * Story and Content Types
 */
export interface Story {
  id: string;
  title: string;
  content: string;
  difficulty: number;
  ageRange: [number, number];
  categories: string[];
  imageUrl?: string;
  estimatedReadTime: number;
}

export interface StoryProgress {
  currentPage: number;
  totalPages: number;
  wordsRead: number;
  accuracy: number;
  timeSpent: number;
}

/**
 * Badge and Achievement Types
 */
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  dateEarned: FirebaseFirestore.Timestamp;
}

/**
 * API Response Types
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
}

/**
 * Navigation Types
 */
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Registration: undefined;
  Home: undefined;
  StoryLibrary: undefined;
  Reading: { storyId: string };
  Progress: undefined;
  ParentDashboard: undefined;
  Settings: undefined;
};

export type NavigationProps<T extends keyof RootStackParamList> = {
  navigation: NavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};

/**
 * Redux Store Types
 */
export interface RootState {
  auth: AuthState;
  reading: ReadingState;
  settings: SettingsState;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface ReadingState {
  currentStory: Story | null;
  progress: StoryProgress;
  isLoading: boolean;
  error: string | null;
}

export interface SettingsState {
  settings: UserSettings;
  isLoading: boolean;
  error: string | null;
}

/**
 * Error Types
 */
export interface AppError extends Error {
  code?: string;
  context?: Record<string, unknown>;
}

export type ErrorCallback = (error: AppError) => void;

/**
 * Utility Types
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type ValidationResult = {
  isValid: boolean;
  errors: string[];
};
