// src/types/index.ts
// Environment Configuration
export interface EnvConfig {
  FIREBASE_API_KEY: string;
  FIREBASE_AUTH_DOMAIN: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_MESSAGING_SENDER_ID: string;
  FIREBASE_APP_ID: string;
  FIREBASE_MEASUREMENT_ID: string;
  API_URL: string;
  ENV: 'development' | 'production' | 'test';
}

// API Response Types
export interface BaseResponse {
  success: boolean;
  message?: string;
  timestamp?: number;
}

export interface PaginatedResponse<T> extends BaseResponse {
  data: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

// Export all other types
export * from './env';
export * from './firebase.types';
export * from './reading';
export * from './user';
