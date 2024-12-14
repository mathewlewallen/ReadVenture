/**
 * Global test setup configuration file
 * Configures testing library extensions and MSW server for API mocking
 */
import '@testing-library/jest-native/extend-expect';

// Mock configurations
jest.mock('react-native-config', () => ({
  FIREBASE_API_KEY: 'test-key',
  FIREBASE_AUTH_DOMAIN: 'test-domain',
  FIREBASE_PROJECT_ID: 'test-project',
  FIREBASE_STORAGE_BUCKET: 'test-bucket',
  FIREBASE_MESSAGING_SENDER_ID: 'test-sender',
  FIREBASE_APP_ID: 'test-app',
  FIREBASE_MEASUREMENT_ID: 'test-measurement',
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

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

jest.mock('react-native-gesture-handler', () => ({}));

// Test environment configuration
jest.setTimeout(10000);

// Console handling
const originalError = console.error;
const originalWarn = console.warn;

console.error = (...args) => {
  if (args[0]?.includes('Testing Library')) {
    return;
  }
  originalError.call(console, ...args);
};

console.warn = (...args) => {
  if (args[0]?.includes('act')) {
    return;
  }
  originalWarn.call(console, ...args);
};

// MSW Server Setup
let server;
try {
  server = require('./mocks/server').server;
} catch (error) {
  console.warn('MSW server not found, skipping MSW setup');
}

if (server) {
  beforeAll(async () => {
    await server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(async () => {
    server.resetHandlers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(async () => {
    await server.close();
    console.error = originalError;
    console.warn = originalWarn;
  });
}

export { server };
