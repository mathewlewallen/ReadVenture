/**
 * Type definitions for environment configuration
 *
 * Defines types for environment variables and configuration settings.
 * Ensures type safety and validates required values.
 *
 * @packageDocumentation
 */

/**
 * Configuration interface for react-native-config
 * Required environment variables for the application
 */
declare module 'react-native-config' {
  /**
   * Environment configuration interface
   */
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

    // Analytics configuration
    readonly ANALYTICS_ENABLED: 'true' | 'false';
    readonly ERROR_REPORTING_ENABLED: 'true' | 'false';

    // Cache configuration
    readonly CACHE_TTL: `${number}`;
    readonly MAX_CACHE_SIZE: `${number}`;

    // API Rate limiting
    readonly API_RATE_LIMIT: `${number}`;
    readonly API_RATE_LIMIT_WINDOW: `${number}`;
  }

  // Ensure Config is read-only
  const Config: Readonly<Config>;
  export default Config;
}

/**
 * Global type augmentation for Node.js process environment
 */
declare global {
  namespace NodeJS {
    /**
     * Extended ProcessEnv interface with our configuration
     */
    interface ProcessEnv extends Readonly<Config> {
      // Node environment
      readonly NODE_ENV: 'development' | 'production' | 'test';
      readonly PORT?: `${number}`;
      readonly HOST?: string;
      readonly DEBUG?: 'true' | 'false';

      // Database configuration
      readonly MONGO_URI?: string;
      readonly REDIS_URL?: string;

      // Security configuration
      readonly JWT_SECRET?: string;
      readonly JWT_EXPIRY?: `${number}`;
      readonly CORS_ORIGIN?: string;
      readonly MAX_REQUEST_SIZE?: `${number}`;

      // Testing configuration
      readonly TEST_MODE?: 'true' | 'false';
      readonly MOCK_SERVICES?: 'true' | 'false';
    }
  }
}

/**
 * Required environment variable keys
 */
export type RequiredEnvKeys = keyof import('react-native-config').Config;

/**
 * Environment validation type
 * Ensures all required keys are present and typed correctly
 */
export type ValidateEnv<T extends Record<string, unknown>> = Readonly<
  {
    [K in RequiredEnvKeys]: string;
  } & T
>;

/**
 * Environment variable parsing utilities
 */
export interface EnvUtils {
  /**
   * Parses boolean environment variables
   */
  parseBoolean(value: string): boolean;

  /**
   * Parses numeric environment variables
   */
  parseNumber(value: string): number;

  /**
   * Validates required environment variables
   */
  validateEnv(config: Partial<Config>): config is Config;
}

// Prevent re-declaration merging
export {};
