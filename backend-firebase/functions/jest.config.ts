/**
 * Jest configuration for Firebase Cloud Functions
 * @module jest.config
 */

import type { JestConfigWithTsJest } from 'ts-jest';
import { defaults as tsjPreset } from 'ts-jest/presets';

/**
 * Jest configuration with TypeScript support and ESM compatibility
 * @see {@link https://jestjs.io/docs/configuration}
 */
const config: JestConfigWithTsJest = {
  ...tsjPreset, // Inherit ts-jest defaults
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',

  // Resolve module file extensions in order
  moduleFileExtensions: [
    'ts',
    'tsx',
    'mts',
    'js',
    'jsx',
    'mjs',
    'json',
    'node'
  ],

  // ESM support
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.mts'],

  // Test configuration
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],

  // TypeScript transformation
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '<rootDir>/tsconfig.json',
        diagnostics: {
          ignoreCodes: [151001] // Ignore ESM warnings
        }
      }
    ]
  },

  // Path aliases and module resolution
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1', // ESM import support
    '^@tests/(.*)$': '<rootDir>/tests/$1'
  },

  // Code coverage configuration
  collectCoverage: process.env.CI === 'true', // Only in CI
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/types/**',
    '!src/mocks/**'
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Performance and resource settings
  maxWorkers: process.env.CI ? '2' : '50%',
  maxConcurrency: 5,

  // Paths to ignore
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    '/.build/',
    '/\\..*/' // Ignore dot folders
  ],

  // Error handling and reporting
  errorOnDeprecated: true,
  verbose: true,
  bail: process.env.CI === 'true' ? 1 : 0, // Fail fast in CI

  // Global setup/teardown
  globalSetup: '<rootDir>/tests/globalSetup.ts',
  globalTeardown: '<rootDir>/tests/globalTeardown.ts',

  // Test timeout
  testTimeout: 10000,
};

export default config;
