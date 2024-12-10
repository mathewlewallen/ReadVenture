// src/__tests__/components/WelcomeScreen.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';

import WelcomeScreen from '../../screens/WelcomeScreen';

describe('WelcomeScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<WelcomeScreen navigation={mockNavigation} />);

    expect(getByText('Welcome to ReadVenture')).toBeTruthy();
  });

  it('navigates to login screen', () => {
    const { getByText } = render(<WelcomeScreen navigation={mockNavigation} />);

    fireEvent.press(getByText('Login'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });
});
