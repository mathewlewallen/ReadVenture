import type { Config } from '@jest/types';

/**
 * Base Jest configuration for React Native projects
 * Extends to individual test configurations
 */
const baseConfig: Config.InitialOptions = {
  preset: 'react-native',

  // Supported file extensions in priority order
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/tests/setup.ts' // Changed from .js to .ts for type safety
  ],

  transform: {
    '^.+\\.(t|j)sx?$': [
      'ts-jest',
      {
        isolatedModules: true,
        tsconfig: 'tsconfig.json'
      }
    ]
  },

  testMatch: [
    '<rootDir>/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/**/*.{spec,test}.[jt]s?(x)'
  ],

  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/android/',
    '<rootDir>/ios/',
    '<rootDir>/dist/',
    '<rootDir>/.history/'
  ],

  // Coverage configuration
  collectCoverage: process.env.CI === 'true', // Only in CI
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.*',
    '!src/**/*.types.ts',
    '!src/types/**/*',
    '!src/constants/**/*'
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  },

  // Module resolution
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    // Handle static assets
    '\\.(jpg|jpeg|png|gif|webp)$': '<rootDir>/tests/__mocks__/fileMock.js',
  },

  moduleDirectories: ['node_modules', 'src'],

  testEnvironment: 'node',
  testEnvironmentOptions: {
    url: 'http://localhost'
  },

  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      diagnostics: {
        warnOnly: !process.env.CI // Warnings fail in CI only
      }
    }
  },

  // Performance settings
  maxWorkers: process.env.CI ? 2 : '50%',
  testTimeout: 10000,

  // Error handling
  errorOnDeprecated: true,
  bail: process.env.CI ? 1 : 0,
};

export default baseConfig;
