/**
 * Environment Validation Tests
 *
 * Tests environment variable validation functionality including:
 * - Required variables presence
 * - Value format validation
 * - Error handling
 *
 * @packageDocumentation
 */

import Config from 'react-native-config';

import { logError } from '../../analytics';
import { validateEnv } from '../envValidation';

// Mock analytics
jest.mock('../../analytics', () => ({
  logError: jest.fn(),
}));

describe('Environment Validation', () => {
  // Store original config for restoration
  const originalConfig = { ...Config };

  // Test configuration mock
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
    // Reset config before each test
    jest.resetModules();
    Object.assign(Config, mockConfig);
  });

  afterEach(() => {
    // Restore original config after each test
    Object.assign(Config, originalConfig);
    jest.clearAllMocks();
  });

  describe('Required Variables', () => {
    it('should validate all required environment variables', () => {
      const result = validateEnv();
      expect(result.isValid).toBeTruthy();
      expect(result.missingVars).toHaveLength(0);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation when required variables are missing', () => {
      // @ts-expect-error - Intentionally setting to undefined for testing
      Config.FIREBASE_API_KEY = undefined;

      const result = validateEnv();
      expect(result.isValid).toBeFalsy();
      expect(result.missingVars).toContain('FIREBASE_API_KEY');
      expect(logError).toHaveBeenCalled();
    });

    it('should fail validation with empty strings', () => {
      // @ts-expect-error - Intentionally setting empty string
      Config.API_URL = '';

      const result = validateEnv();
      expect(result.isValid).toBeFalsy();
      expect(result.errors).toContain('API_URL cannot be empty');
    });
  });

  describe('Value Format Validation', () => {
    it('should validate API_URL format', () => {
      Config.API_URL = 'not-a-url';
      const result = validateEnv();
      expect(result.isValid).toBeFalsy();
      expect(result.errors).toContain('Invalid API_URL format');
    });

    it('should validate APP_ENV values', () => {
      // @ts-expect-error - Testing invalid value
      Config.APP_ENV = 'invalid';
      const result = validateEnv();
      expect(result.isValid).toBeFalsy();
      expect(result.errors).toContain('Invalid APP_ENV value');
    });

    it('should validate numeric values', () => {
      Config.API_TIMEOUT = 'not-a-number';
      const result = validateEnv();
      expect(result.isValid).toBeFalsy();
      expect(result.errors).toContain('API_TIMEOUT must be a number');
    });
  });

  describe('Boolean Values', () => {
    it('should validate boolean string values', () => {
      Config.DEBUG_MODE = 'invalid';
      const result = validateEnv();
      expect(result.isValid).toBeFalsy();
      expect(result.errors).toContain('DEBUG_MODE must be "true" or "false"');
    });

    it('should accept valid boolean strings', () => {
      Config.DEBUG_MODE = 'true';
      Config.ENABLE_PUSH_NOTIFICATIONS = 'false';
      const result = validateEnv();
      expect(result.isValid).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should handle undefined Config object', () => {
      // @ts-expect-error - Testing undefined config
      Config = undefined;

      const result = validateEnv();
      expect(result.isValid).toBeFalsy();
      expect(result.errors).toContain('Environment configuration not found');
      expect(logError).toHaveBeenCalled();
    });

    it('should log validation errors', () => {
      Config.FIREBASE_API_KEY = '';
      validateEnv();
      expect(logError).toHaveBeenCalledWith(
        'Environment validation failed',
        expect.any(Error),
      );
    });
  });
});
