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
    'FIREBASE_MEASUREMENT_ID'
  ] as const;

  beforeEach(() => {
    // Store original config
    jest.resetModules();
  });

  // Test each required key individually
  test.each(requiredKeys)('has %s configured', (key) => {
    expect(Config[key]).toBeDefined();
    expect(Config[key].length).toBeGreaterThan(0);
  });

  // Test validateEnvironment function
  it('should validate all required environment variables', () => {
    expect(validateEnvironment()).toBeTruthy();
  });

  it('should fail validation when any required variable is missing', () => {
    const originalConfig = { ...Config };
    
    // Test each required key
    requiredKeys.forEach(key => {
      // @ts-ignore - for testing
      Config[key] = undefined;
      expect(validateEnvironment()).toBeFalsy();
      // @ts-ignore - restore original value
      Config[key] = originalConfig[key];
    });
  });

  it('should fail validation when any required variable is empty', () => {
    const originalConfig = { ...Config };
    
    requiredKeys.forEach(key => {
      // @ts-ignore - for testing
      Config[key] = '';
      expect(validateEnvironment()).toBeFalsy();
      // @ts-ignore - restore original value
      Config[key] = originalConfig[key];
    });
  });

  afterEach(() => {
    // Restore original config after each test
    jest.resetModules();
  });
});