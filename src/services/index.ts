// // Generated barrel file - do not modify manually

export {
  authEndpoints,
  validateCredentials,
  ProgressService,
  progressService,
  storyEndpoints,
  User,
  storage,
} from './api';
export type {
  UserRole,
  Theme,
  TextSize,
  User,
  UserSettings,
  UserProgress,
  Badge,
  ReadingSession,
  ParentData,
  ApiResponse,
  PaginatedResponse,
  AuthResponse,
  StoryListResponse,
  ProgressResponse,
  SettingsResponse,
  ErrorResponse,
  ValidationErrorResponse,
  AnalyticsResponse,
  ApiResponseType,
  PaginatedResponseType,
} from './api';
export { authService, databaseService, storageService } from './firebase';
export type { FirebaseServices } from './firebase';
export { TextAnalyzer, apiService, AnalysisErrorType } from './ml';
export type {
  TextMetrics,
  TextComplexity,
  AnalysisResult,
  ComprehensionAreas,
  ComprehensionResult,
  ReadingProgress,
  AnalysisConfig,
  AnalysisError,
  AnalysisCallback,
  ErrorCallback,
} from './ml';
