// tests/setup/jest.setup.ts
import '@testing-library/jest-native/extend-expect';

// Mock react-native-config
jest.mock('react-native-config', () => ({
  FIREBASE_API_KEY: 'test-key',
  FIREBASE_AUTH_DOMAIN: 'test-domain',
  FIREBASE_PROJECT_ID: 'test-project',
  FIREBASE_STORAGE_BUCKET: 'test-bucket',
  FIREBASE_MESSAGING_SENDER_ID: 'test-sender',
  FIREBASE_APP_ID: 'test-app',
  FIREBASE_MEASUREMENT_ID: 'test-measurement',
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock firebase configurations
jest.mock('../../src/firebaseConfig', () => ({
  auth: {
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
  },
  db: {
    collection: jest.fn(),
    doc: jest.fn(),
  },
}));

jest.mock('@react-native-firebase/auth', () => ({
  auth: jest.fn(() => ({
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
  })),
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {});

// Set up global jest configuration
global.jest = jest;
