/**
 * API Response Types
 *
 * Type definitions for API responses with proper error handling,
 * pagination support, and type safety.
 *
 * @packageDocumentation
 */

import { FirebaseFirestore } from '@firebase/firestore-types';
import { Story, User, ReadingProgress, UserSettings } from '../../types';

/**
 * Base API response interface
 */
export interface ApiResponse<T> {
  /** Response data */
  data: T;
  /** Success status */
  success: boolean;
  /** Optional status message */
  message?: string;
  /** Optional error details */
  errors?: string[];
  /** Response timestamp */
  timestamp: string;
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  /** Current page number */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of items */
  totalItems: number;
  /** Whether there is a next page */
  hasNextPage: boolean;
  /** Whether there is a previous page */
  hasPrevPage: boolean;
}

/**
 * Authentication response
 */
export interface AuthResponse extends ApiResponse<User> {
  /** JWT authentication token */
  token: string;
  /** Token expiration timestamp */
  expiresAt: string;
  /** Refresh token */
  refreshToken: string;
}

/**
 * Story list response
 */
export interface StoryListResponse extends PaginatedResponse<Story> {
  /** Filter criteria used */
  filters?: {
    difficulty?: number;
    ageRange?: [number, number];
    category?: string;
  };
  /** Sort criteria used */
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

/**
 * Reading progress response
 */
export interface ProgressResponse extends ApiResponse<ReadingProgress> {
  /** Story ID for the progress */
  storyId: string;
  /** Last updated timestamp */
  updatedAt: FirebaseFirestore.Timestamp;
  /** Reading session duration */
  sessionDuration: number;
}

/**
 * Settings update response
 */
export interface SettingsResponse extends ApiResponse<UserSettings> {
  /** Previous settings */
  previousSettings: UserSettings;
  /** Update timestamp */
  updatedAt: FirebaseFirestore.Timestamp;
}

/**
 * Error response
 */
export interface ErrorResponse {
  /** Error code */
  code: string;
  /** Error message */
  message: string;
  /** Detailed error information */
  details?: Record<string, unknown>;
  /** Request ID for tracking */
  requestId: string;
  /** Error timestamp */
  timestamp: string;
}

/**
 * Validation error response
 */
export interface ValidationErrorResponse extends ErrorResponse {
  /** Field-specific validation errors */
  fieldErrors: {
    /** Field name */
    field: string;
    /** Error message */
    message: string;
    /** Error code */
    code: string;
  }[];
}

/**
 * Analytics response
 */
export interface AnalyticsResponse
  extends ApiResponse<{
    /** Total reading time */
    totalReadingTime: number;
    /** Average accuracy */
    averageAccuracy: number;
    /** Words read per minute */
    wordsPerMinute: number;
    /** Reading streak days */
    streakDays: number;
  }> {
  /** Time period for analytics */
  period: 'day' | 'week' | 'month' | 'year';
  /** Start date of period */
  startDate: string;
  /** End date of period */
  endDate: string;
}

export type ApiResponseType<T> = Promise<ApiResponse<T>>;
export type PaginatedResponseType<T> = Promise<PaginatedResponse<T>>;
