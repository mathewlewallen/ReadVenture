/**
 * @format
 */

import 'react-native';
import React from 'react';
// Update import path to match project structure
import App from '../../../../src/App';

// Note: import explicitly to use the types shipped with jest.
import { it } from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  // Add type assertion to handle deprecated signature warning
  renderer.create(<App />) as renderer.ReactTestRenderer;
});
