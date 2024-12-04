import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SettingsScreen from '../src/screens/SettingsScreen';

describe('SettingsScreen', () => {
  it('toggles sound effects setting', () => {
    const { getByText } = render(<SettingsScreen />);
    const soundEffectsSwitch = getByText('Sound Effects').parentNode.querySelector('Switch');

    expect(soundEffectsSwitch.props.value).toBe(true);

    fireEvent(soundEffectsSwitch, 'valueChange', false);

    expect(soundEffectsSwitch.props.value).toBe(false);
  });

  it('navigates to TextSizeSettings screen', () => {
    const navigate = jest.fn();
    const { getByText } = render(<SettingsScreen navigation={{ navigate }} />);
    const textSizeItem = getByText('Text Size').parentNode;

    fireEvent.press(textSizeItem);

    expect(navigate).toHaveBeenCalledWith('TextSizeSettings');
  });

  it('navigates to ReadingSpeedSettings screen', () => {
    const navigate = jest.fn();
    const { getByText } = render(<SettingsScreen navigation={{ navigate }} />);
    const readingSpeedItem = getByText('Reading Speed').parentNode;

    fireEvent.press(readingSpeedItem);

    expect(navigate).toHaveBeenCalledWith('ReadingSpeedSettings');
  });

  it('navigates to HighlightingColorSettings screen', () => {
    const navigate = jest.fn();
    const { getByText } = render(<SettingsScreen navigation={{ navigate }} />);
    const highlightingColorItem = getByText('Highlighting Color').parentNode;

    fireEvent.press(highlightingColorItem);

    expect(navigate).toHaveBeenCalledWith('HighlightingColorSettings');
  });
});