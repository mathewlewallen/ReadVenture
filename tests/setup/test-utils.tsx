// src/__tests__/setup/test-utils.tsx
import { NavigationContainer } from '@react-navigation/native';
import { render, RenderOptions } from '@testing-library/react-native';
import React from 'react';
import { Provider } from 'react-redux';

import store from '../../src/store';

interface ProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: ProvidersProps) => {
  return (
    <Provider store={store}>
      <NavigationContainer>{children}</NavigationContainer>
    </Provider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options: Omit<RenderOptions, 'wrapper'> = {},
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react-native';
export { customRender as render };
