// src/utils/validation/__tests__/envValidation.test.ts
import Config from 'react-native-config';
import { validateEnv } from '../envValidation';

describe('Environment Validation', () => {
  const mockConfig = {
    FIREBASE_API_KEY: 'test-key',
    FIREBASE_AUTH_DOMAIN: 'test.domain',
    FIREBASE_PROJECT_ID: 'test-project',
    FIREBASE_STORAGE_BUCKET: 'test-bucket',
    FIREBASE_MESSAGING_SENDER_ID: 'test-sender',
    FIREBASE_APP_ID: 'test-app-id',
    FIREBASE_MEASUREMENT_ID: 'test-measurement',
    API_URL: 'http://test.com',
    APP_ENV: 'development',
    API_TIMEOUT: '30000',
    DEBUG_MODE: 'true',
    ENABLE_PUSH_NOTIFICATIONS: 'false',
  };

  beforeEach(() => {
    Object.assign(Config, mockConfig);
  });

  it('should validate all required environment variables', () => {
    expect(validateEnv()).toBeTruthy();
  });

  it('should fail validation when required variables are missing', () => {
    // @ts-expect-error - Intentionally setting to undefined for testing
    Config.FIREBASE_API_KEY = undefined;
    expect(validateEnv()).toBeFalsy();
  });

  it('should fail validation with empty strings', () => {
    // @ts-expect-error - Intentionally setting empty string
    Config.API_URL = '';
    expect(validateEnv()).toBeFalsy();
  });
});
