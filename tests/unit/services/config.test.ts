// src/__tests__/config.test.ts
import Config from 'react-native-config';
import { validateEnvironment } from '../App';

describe('Environment Configuration', () => {
  const requiredKeys = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID',
    'FIREBASE_MEASUREMENT_ID',
  ] as const;

  const originalConfig = { ...Config };

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    Object.assign(Config, originalConfig);
  });

  afterEach(() => {
    Object.assign(Config, originalConfig);
  });

  describe('Required Environment Variables', () => {
    test.each(requiredKeys)('has %s configured', (key) => {
      expect(Config[key]).toBeDefined();
      expect(Config[key].length).toBeGreaterThan(0);
    });
  });

  describe('validateEnvironment', () => {
    it('should validate all required environment variables', () => {
      expect(validateEnvironment()).toBeTruthy();
    });

    it('should fail validation when any required variable is missing', () => {
      requiredKeys.forEach((key) => {
        const tempConfig = { ...Config };
        delete tempConfig[key];
        Object.assign(Config, tempConfig);
        expect(() => validateEnvironment()).toThrow(
          `Missing required environment variable: ${key}`
        );
        Object.assign(Config, originalConfig);
      });
    });

    it('should fail validation when any required variable is empty', () => {
      requiredKeys.forEach((key) => {
        const tempConfig = { ...Config };
        tempConfig[key] = '';
        Object.assign(Config, tempConfig);
        expect(() => validateEnvironment()).toThrow(`Empty required environment variable: ${key}`);
        Object.assign(Config, originalConfig);
      });
    });

    it('should handle invalid environment variable types', () => {
      requiredKeys.forEach((key) => {
        const tempConfig = { ...Config };
        // @ts-expect-error - Testing invalid types
        tempConfig[key] = null;
        Object.assign(Config, tempConfig);
        expect(() => validateEnvironment()).toThrow(`Invalid environment variable: ${key}`);
        Object.assign(Config, originalConfig);
      });
    });
  });

  describe('Optional Environment Variables', () => {
    const optionalKeys = ['DEBUG_MODE', 'API_TIMEOUT', 'CACHE_DURATION'] as const;

    test.each(optionalKeys)('handles optional %s configuration', (key) => {
      const tempConfig = { ...Config };
      delete tempConfig[key];
      Object.assign(Config, tempConfig);
      expect(validateEnvironment()).toBeTruthy();
    });
  });
});
