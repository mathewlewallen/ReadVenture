// Import required dependencies
import AsyncStorage from '@react-native-async-storage/async-storage';
import { render } from '@testing-library/react-native';
import React from 'react';

import ProgressScreen from '../../../../src/screens/ProgressScreen';

describe('ProgressScreen', () => {
  it('loads and displays progress from AsyncStorage', async () => {
    await AsyncStorage.setItem(
      'progress',
      JSON.stringify({ wordsRead: 150, storiesCompleted: 8 }),
    );
    const { findByText } = render(<ProgressScreen />);
    await findByText('Words read: 150');
    await findByText('Stories completed: 8');
  });

  it('displays default progress if no data is in AsyncStorage', async () => {
    const { findByText } = render(<ProgressScreen />);
    await findByText('Words read: 0');
    await findByText('Stories completed: 0');
  });

  it('displays progress bar with correct value', async () => {
    await AsyncStorage.setItem(
      'progress',
      JSON.stringify({ wordsRead: 50, storiesCompleted: 2 }),
    );
    const { getByTestId } = render(<ProgressScreen />);
    // Remove await since getByTestId returns synchronously
    const progressBar = getByTestId('progress-bar');
    expect(progressBar.props.progress).toBe(0.5);
  });

  it('displays badges earned', async () => {
    await AsyncStorage.setItem('badges', JSON.stringify(['badge1', 'badge3']));
    const { findByText } = render(<ProgressScreen />);
    await findByText('badge1');
    await findByText('badge3');
  });
});
