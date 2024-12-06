import type { Config } from '@jest/types';

/**
 * Jest configuration for React Native project with TypeScript and React Testing Library
 */
const config: Config.InitialOptions = {
  preset: 'react-native',

  // Test environment
  testEnvironment: 'jsdom',

  // Simplify test patterns
  testMatch: ['<rootDir>/tests/**/*.test.{ts,tsx}'],

  // Module mappings
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
    '^@/(.*)$': '<rootDir>/src/$1', // Added from second config
    '^@tests/(.*)$': '<rootDir>/tests/$1', // Added from second config
  },

  // Transform configuration
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@react-native-firebase|@react-native-community)/)',
  ],

  // Update setup files
  setupFiles: [
    '<rootDir>/tests/setup/jest.setup.ts',
    '<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js',
  ],

  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],

  // Coverage settings
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/', '/__mocks__/'],
};

export default config;
