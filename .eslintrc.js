/** @type {import('@typescript-eslint/utils').TSESLint.Linter.Config} */
module.exports = {
  root: true,
  extends: [
    '@react-native',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'plugin:jest/recommended',
    'prettier',
  ],

  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2023,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },

  plugins: [
    '@typescript-eslint',
    'react',
    'react-native',
    'jest',
    'prettier',
    'import',
  ],

  env: {
    'react-native/react-native': true,
    jest: true,
    es2023: true,
    node: true,
  },

  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
      node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] }
    },
  },

  rules: {
    // TypeScript
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],

    // React & React Native
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/prop-types': 'off', // Using TypeScript instead
    'react-native/no-inline-styles': 'warn',
    'react-native/no-raw-text': ['error', { skip: ['CustomText'] }],

    // Code Style
    'prettier/prettier': 'error',
    'max-len': ['error', { code: 100, ignoreUrls: true }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],

    // Imports
    'import/order': ['error', {
      groups: [
        ['builtin', 'external'],
        'internal',
        ['parent', 'sibling', 'index'],
      ],
      'newlines-between': 'always',
      alphabetize: { order: 'asc' }
    }],
  },

  overrides: [
    {
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      env: { jest: true },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'max-len': 'off',
      }
    },
    {
      files: ['backend/**/*.[jt]s'],
      rules: {
        'react-native/no-raw-text': 'off',
        'react-native/no-inline-styles': 'off',
      }
    }
  ],

  ignorePatterns: [
    'node_modules/',
    'dist/',
    'coverage/',
    'android/',
    'ios/',
    '*.config.js',
    'babel.config.js',
    'metro.config.js',
  ],
};
