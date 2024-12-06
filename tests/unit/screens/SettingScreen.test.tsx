// /ReadVenture/tests/unit/screens/SettingsScreen.test.ts
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SettingsScreen from '../src/screens/SettingsScreen';

type RootStackParamList = {
  Settings: undefined;
  TextSizeSettings: undefined;
  ReadingSpeedSettings: undefined;
  HighlightingColorSettings: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

describe('SettingsScreen', () => {
  it('toggles sound effects setting', () => {
    const { getByText } = render(<SettingsScreen navigation={{} as NavigationProp} />);
    const soundEffectsSwitch = getByText('Sound Effects').parentNode.querySelector('Switch');

    expect(soundEffectsSwitch.props.value).toBe(true);

    fireEvent(soundEffectsSwitch, 'valueChange', false);

    expect(soundEffectsSwitch.props.value).toBe(false);
  });

  it('navigates to TextSizeSettings screen', () => {
    const navigate = jest.fn();
    const { getByText } = render(
      <SettingsScreen navigation={{ navigate } as unknown as NavigationProp} />
    );
    const textSizeItem = getByText('Text Size').parentNode;

    fireEvent.press(textSizeItem);

    expect(navigate).toHaveBeenCalledWith('TextSizeSettings');
  });

  it('navigates to ReadingSpeedSettings screen', () => {
    const navigate = jest.fn();
    const { getByText } = render(
      <SettingsScreen navigation={{ navigate } as unknown as NavigationProp} />
    );
    const readingSpeedItem = getByText('Reading Speed').parentNode;

    fireEvent.press(readingSpeedItem);

    expect(navigate).toHaveBeenCalledWith('ReadingSpeedSettings');
  });

  it('navigates to HighlightingColorSettings screen', () => {
    const navigate = jest.fn();
    const { getByText } = render(
      <SettingsScreen navigation={{ navigate } as unknown as NavigationProp} />
    );
    const highlightingColorItem = getByText('Highlighting Color').parentNode;

    fireEvent.press(highlightingColorItem);

    expect(navigate).toHaveBeenCalledWith('HighlightingColorSettings');
  });
});
