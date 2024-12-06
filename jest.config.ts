import type { Config } from '@jest/types';

/**
 * Jest configuration for React Native project with TypeScript and React Testing Library
 */
const config: Config.InitialOptions = {
  preset: 'react-native',

  // Test environment
  testEnvironment: 'jsdom',

  // File patterns
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Module mappings
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
  },

  // Transform configuration
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@react-native-firebase|@react-native-community)/)',
  ],

  // Setup files
  setupFiles: ['<rootDir>/tests/setup/jest.setup.ts'],

  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],

  // Coverage settings
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/', '/__mocks__/'],
};

export default config;
