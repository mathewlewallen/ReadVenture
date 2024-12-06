/**
 * Type definitions for environment configuration
 * @packageDocumentation
 */

/**
 * Configuration interface for react-native-config
 * Required environment variables for the application
 */
declare module 'react-native-config' {
  export interface Config {
    // Firebase configuration
    readonly FIREBASE_API_KEY: string;
    readonly FIREBASE_AUTH_DOMAIN: string;
    readonly FIREBASE_PROJECT_ID: string;
    readonly FIREBASE_STORAGE_BUCKET: string;
    readonly FIREBASE_MESSAGING_SENDER_ID: string;
    readonly FIREBASE_APP_ID: string;
    readonly FIREBASE_MEASUREMENT_ID: string;

    // Application configuration
    readonly API_URL: string;
    readonly API_TIMEOUT: `${number}`; // Ensuring numeric string
    readonly APP_ENV: 'development' | 'production' | 'staging';
    readonly DEBUG_MODE: 'true' | 'false'; // Strict boolean string
    readonly ENABLE_PUSH_NOTIFICATIONS: 'true' | 'false';
  }

  const Config: Readonly<Config>;
  export default Config;
}

/**
 * Global type augmentation for Node.js process environment
 */
declare global {
  namespace NodeJS {
    // Merge base ProcessEnv with our Config
    interface ProcessEnv extends Readonly<Config> {
      readonly NODE_ENV: 'development' | 'production' | 'test';
      readonly PORT?: `${number}`;
      readonly HOST?: string;
      readonly DEBUG?: 'true' | 'false';
      readonly MONGO_URI?: string;
      readonly JWT_SECRET?: string;
    }
  }
}

/**
 * Required environment variable keys
 */
export type RequiredEnvKeys = keyof import('react-native-config').Config;

/**
 * Type to validate environment configuration
 * Ensures all required keys are present and typed correctly
 */
export type ValidateEnv<T extends Record<string, unknown>> = Readonly<{
  [K in RequiredEnvKeys]: string;
} & T>;

// Prevent re-declaration merging
export {};
