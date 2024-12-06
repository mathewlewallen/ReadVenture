import Config from 'react-native-config';
import baseConfig from '../jest.config.base';

/**
 * Required environment configuration interface for Firebase setup
 */
interface EnvConfig {
  readonly FIREBASE_API_KEY: string;
  readonly FIREBASE_AUTH_DOMAIN: string;
  readonly FIREBASE_PROJECT_ID: string;
  readonly FIREBASE_STORAGE_BUCKET: string;
  readonly FIREBASE_MESSAGING_SENDER_ID: string;
  readonly FIREBASE_APP_ID: string;
  readonly FIREBASE_MEASUREMENT_ID: string;
}

/**
 * Validates required Firebase configuration variables
 * @returns {boolean} True if all required variables are present and non-empty
 * @throws {Error} If Config is undefined or not properly loaded
 */
export const validateConfig = (): boolean => {
  if (!Config) {
    throw new Error('React Native Config not properly initialized');
  }

  const requiredKeys: ReadonlyArray<keyof EnvConfig> = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID',
    'FIREBASE_MEASUREMENT_ID',
  ];

  const missingKeys = requiredKeys.filter(key => !Config[key]?.trim());

  if (missingKeys.length > 0) {
    console.error(
      `Missing or empty required env variables: ${missingKeys.join(', ')}`
    );
    return false;
  }

  return true;
};

/**
 * Extended Jest configuration for specific test requirements
 */
const testConfig = {
  ...baseConfig,
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/config/tests/setup.ts'],
} as const;

export default testConfig;
