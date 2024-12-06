// Tests for the SettingsScreen component
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SettingsScreen from '../../../src/screens/SettingsScreen'; // Fixed import path

// Define navigation types for type safety
type RootStackParamList = {
  Settings: undefined;
  TextSizeSettings: undefined;
  ReadingSpeedSettings: undefined;
  HighlightingColorSettings: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

describe('SettingsScreen', () => {
  // Test sound effects toggle functionality
  it('toggles sound effects setting', () => {
    const { getByTestId } = render(
      <SettingsScreen navigation={{} as NavigationProp} />,
    );
    const soundEffectsSwitch = getByTestId('sound-effects-switch');

    expect(soundEffectsSwitch.props.value).toBe(true);
    fireEvent(soundEffectsSwitch, 'valueChange', false);
    expect(soundEffectsSwitch.props.value).toBe(false);
  });

  // Test navigation to different settings screens
  it.each([
    ['Text Size', 'TextSizeSettings'],
    ['Reading Speed', 'ReadingSpeedSettings'],
    ['Highlighting Color', 'HighlightingColorSettings'],
  ])('navigates to %s settings screen', (buttonText, destination) => {
    const navigate = jest.fn();
    const { getByTestId } = render(
      <SettingsScreen navigation={{ navigate } as unknown as NavigationProp} />,
    );

    const settingButton = getByTestId(`${buttonText.toLowerCase()}-button`);
    fireEvent.press(settingButton);

    expect(navigate).toHaveBeenCalledWith(destination);
  });
});
