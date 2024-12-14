/**
 * Environment Validation Utilities
 *
 * Validates required environment variables and configuration settings.
 * Provides type-safe validation and detailed error reporting.
 *
 * @packageDocumentation
 */

import Config from 'react-native-config';

import { logError } from '../../utils/analytics';

/**
 * Environment configuration interface
 */
interface EnvConfig {
  // Firebase (Required)
  FIREBASE_API_KEY: string;
  FIREBASE_AUTH_DOMAIN: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_MESSAGING_SENDER_ID: string;
  FIREBASE_APP_ID: string;
  FIREBASE_MEASUREMENT_ID: string;

  // App Config (Required)
  API_URL: string;
  APP_ENV: 'development' | 'staging' | 'production';

  // Optional
  DEBUG_MODE?: 'true' | 'false';
  API_TIMEOUT?: string;
  SENTRY_DSN?: string;
  ANALYTICS_KEY?: string;
  ENABLE_PUSH_NOTIFICATIONS?: 'true' | 'false';
  NODE_ENV?: string;
}

/**
 * Required environment variables
 */
const REQUIRED_ENV_VARS = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
  'FIREBASE_MEASUREMENT_ID',
  'API_URL',
  'APP_ENV',
] as const;

/**
 * Environment validation result
 */
interface ValidationResult {
  isValid: boolean;
  missingVars: string[];
  errors: string[];
}

/**
 * Validates environment configuration
 * @returns Validation result with details
 */
export const validateEnv = (): ValidationResult => {
  const result: ValidationResult = {
    isValid: true,
    missingVars: [],
    errors: [],
  };

  try {
    // Check for required variables
    REQUIRED_ENV_VARS.forEach((key) => {
      const value = Config[key as keyof typeof Config];
      if (!value || value.trim() === '') {
        result.isValid = false;
        result.missingVars.push(key);
      }
    });

    // Validate API URL format
    if (Config.API_URL && !isValidUrl(Config.API_URL)) {
      result.isValid = false;
      result.errors.push('Invalid API_URL format');
    }

    // Validate environment type
    if (
      Config.APP_ENV &&
      !['development', 'staging', 'production'].includes(Config.APP_ENV)
    ) {
      result.isValid = false;
      result.errors.push('Invalid APP_ENV value');
    }

    // Validate numeric values
    if (Config.API_TIMEOUT && !isValidNumber(Config.API_TIMEOUT)) {
      result.isValid = false;
      result.errors.push('Invalid API_TIMEOUT value');
    }

    return result;
  } catch (error) {
    logError('Environment validation failed:', error);
    return {
      isValid: false,
      missingVars: [],
      errors: [(error as Error).message],
    };
  }
};

/**
 * Gets environment configuration with type safety
 * @throws {Error} If required variables are missing
 */
export const getEnvConfig = (): EnvConfig => {
  const validation = validateEnv();

  if (!validation.isValid) {
    const errorMessage = [
      'Invalid environment configuration:',
      ...validation.missingVars.map((v) => `Missing ${v}`),
      ...validation.errors,
    ].join('\n');

    throw new Error(errorMessage);
  }

  return Config as EnvConfig;
};

/**
 * Validates URL format
 */
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates numeric string
 */
const isValidNumber = (value: string): boolean => {
  return !isNaN(Number(value)) && isFinite(Number(value));
};

export default {
  validateEnv,
  getEnvConfig,
};
