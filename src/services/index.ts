/**
 * Root service exports for the application
 * @module services
 */

// Core services
export * from './api';
export * from './firebase';
export * from './ml';

// Type exports
export type { ApiConfig } from './api/types';
export type { FirebaseConfig } from './firebase/types';
export type { MLConfig } from './ml/types';

// Constants
export { API_VERSION } from './api/constants';
export { ML_MODELS } from './ml/constants';

// Error types
export { ApiError } from './api/errors';
export { FirebaseError } from './firebase/errors';
export { MLError } from './ml/errors';
