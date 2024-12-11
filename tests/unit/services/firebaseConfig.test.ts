// src/__tests__/firebase/firebaseConfig.test.ts
import { getAnalytics } from 'firebase/analytics';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Config from 'react-native-config';

import { initializeFirebase } from '../../config/firebase';

// Mock react-native-config
jest.mock('react-native-config', () => ({
  FIREBASE_API_KEY: 'test-api-key',
  FIREBASE_AUTH_DOMAIN: 'test-domain',
  FIREBASE_PROJECT_ID: 'test-project',
  FIREBASE_STORAGE_BUCKET: 'test-bucket',
  FIREBASE_MESSAGING_SENDER_ID: 'test-sender',
  FIREBASE_APP_ID: 'test-app-id',
  FIREBASE_MEASUREMENT_ID: 'test-measurement-id',
}));

// Mock Firebase modules
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  FirebaseOptions: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
}));

jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn(),
}));

describe('Firebase Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('should initialize Firebase with correct configuration', () => {
    const expectedConfig: FirebaseOptions = {
      apiKey: Config.FIREBASE_API_KEY,
      authDomain: Config.FIREBASE_AUTH_DOMAIN,
      projectId: Config.FIREBASE_PROJECT_ID,
      storageBucket: Config.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: Config.FIREBASE_MESSAGING_SENDER_ID,
      appId: Config.FIREBASE_APP_ID,
      measurementId: Config.FIREBASE_MEASUREMENT_ID,
    };

    initializeFirebase();

    expect(initializeApp).toHaveBeenCalledWith(expectedConfig);
    expect(getAuth).toHaveBeenCalled();
    expect(getFirestore).toHaveBeenCalled();
    expect(getAnalytics).toHaveBeenCalled();
  });

  it('should throw error when required config is missing', () => {
    const originalConfig = { ...Config };
    // @ts-expect-error - Testing missing config
    delete Config.FIREBASE_API_KEY;

    expect(() => initializeFirebase()).toThrow(
      'Missing required Firebase configuration',
    );

    Object.assign(Config, originalConfig);
  });

  it('should handle firebase initialization errors', () => {
    const mockError = new Error('Firebase initialization failed');
    (initializeApp as jest.Mock).mockImplementationOnce(() => {
      throw mockError;
    });

    expect(() => initializeFirebase()).toThrow(mockError);
  });

  it('should initialize firebase only once', () => {
    initializeFirebase();
    initializeFirebase();
    initializeFirebase();

    expect(initializeApp).toHaveBeenCalledTimes(1);
  });

  it('should validate firebase configuration', () => {
    const invalidConfigs = {
      apiKey: '',
      projectId: null,
      appId: undefined,
    };

    Object.entries(invalidConfigs).forEach(([key, value]) => {
      const originalConfig = { ...Config };
      // @ts-expect-error - Testing invalid configs
      Config[`FIREBASE_${key.toUpperCase()}`] = value;

      expect(() => initializeFirebase()).toThrow(
        `Invalid Firebase configuration: ${key}`,
      );

      Object.assign(Config, originalConfig);
    });
  });
});
