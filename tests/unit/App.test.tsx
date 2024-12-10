/**
 * @format
 */

import 'react-native';
import { it } from '@jest/globals';
import React from 'react';

// Update import path to match project structure
import renderer from 'react-test-renderer';

import App from '../../../../src/App';

// Note: import explicitly to use the types shipped with jest.

// Note: test renderer must be required after react-native.

it('renders correctly', () => {
  // Add type assertion to handle deprecated signature warning
  renderer.create(<App />);
});
