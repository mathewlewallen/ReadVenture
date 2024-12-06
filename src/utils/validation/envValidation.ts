// src/utils/validation/envValidation.ts
import Config from 'react-native-config';

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

export const validateEnv = (): boolean => {
  try {
    return REQUIRED_ENV_VARS.every((key) => {
      const value = Config[key as keyof typeof Config];
      return value !== undefined && value !== '';
    });
  } catch (error) {
    console.error('Environment validation failed:', error);
    return false;
  }
};
