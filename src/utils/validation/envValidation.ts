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
    return REQUIRED_ENV_VARS.every(key => {
      const value = Config[key as keyof typeof Config];
      return value !== undefined && value !== '';
    });
  } catch (error) {
    console.error('Environment validation failed:', error);
    return false;
  }
};
// src/utils/configTest.ts
import Config from 'react-native-config';

// Validates that all required Firebase configuration keys are present in the environment
export const validateConfig = () => {
  const requiredKeys = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID',
    'FIREBASE_MEASUREMENT_ID',
  ];

  const missingKeys = requiredKeys.filter(key => !Config[key]);

  if (missingKeys.length > 0) {
    console.error('Missing required env variables:', missingKeys);
    return false;
  }
  return true;
};
/**
 * Environment and configuration testing utility
 * src/utils/envTest.ts
 */
import Config from 'react-native-config';

/**
 * Tests and logs various configuration values in development environment
 * Only logs in development mode to prevent sensitive data exposure in production
 */
export const testConfig = (): void => {
  // Only execute in development environment
  if (__DEV__) {
    try {
      // Log basic environment settings
      console.log('[ENV] Environment:', Config.APP_ENV);
      console.log('[ENV] API URL:', Config.API_URL);

      // Log Firebase configuration (sensitive - development only)
      console.log('[ENV] Firebase Config:', {
        apiKey: Config.FIREBASE_API_KEY,
        projectId: Config.FIREBASE_PROJECT_ID,
      });
    } catch (error) {
      console.warn('[ENV] Error reading configuration:', error);
    }
  }
};
