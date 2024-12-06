// /Users/mathewlewallen/ReadVenture/tests/unit/screens/ReadingScreen.test.ts
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ReadingScreen from '../src/screens/ReadingScreen';
import { calculateAccuracy } from '../src/screens/ReadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Reading: { storyId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Reading'>;

const mockAxios = new MockAdapter(axios);

describe('ReadingScreen', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    mockAxios.reset();
  });

  it('calculates reading accuracy correctly', () => {
    expect(calculateAccuracy('the quick brown fox', 'the quick brown fox')).toBe(1);
    expect(calculateAccuracy('the quick brown fox', 'the quick brown fox jumps')).toBeLessThan(1);
    expect(calculateAccuracy('the quick brown fox', 'the slow brown fox')).toBeGreaterThan(0.5);
  });

  it('fetches and displays story content', async () => {
    mockAxios.onGet('/stories/test-story-id').reply(200, {
      _id: 'test-story-id',
      title: 'Test Story',
      text: 'This is a test story.',
    });

    const { findByText } = render(
      <ReadingScreen
        route={{ params: { storyId: 'test-story-id' } }}
        navigation={{ navigate: jest.fn() } as any}
      />
    );

    await findByText('Test Story');
    await findByText('This is a test story.');
  });

  it('updates progress when navigating to the next chunk', async () => {
    const mockStory = {
      _id: 'test-story-id',
      title: 'Test Story',
      text: 'This is a longer test story that will be split into chunks for reading.',
    };

    mockAxios.onGet('/stories/test-story-id').reply(200, mockStory);

    const { getByText, findByText } = render(
      <ReadingScreen
        route={{ params: { storyId: 'test-story-id' } }}
        navigation={{ navigate: jest.fn() } as any}
      />
    );

    await findByText('Test Story');
    const nextButton = getByText('Next');
    fireEvent.press(nextButton);

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        `reading-progress-${mockStory._id}`,
        expect.any(String)
      );
    });
  });

  it('handles API errors gracefully', async () => {
    mockAxios.onGet('/stories/test-story-id').reply(500);

    const { findByText } = render(
      <ReadingScreen
        route={{ params: { storyId: 'test-story-id' } }}
        navigation={{ navigate: jest.fn() } as any}
      />
    );

    await findByText('Error loading story');
  });

  it('saves reading progress to AsyncStorage', async () => {
    const mockStory = {
      _id: 'test-story-id',
      title: 'Test Story',
      text: 'Test content',
    };

    mockAxios.onGet('/stories/test-story-id').reply(200, mockStory);

    const { getByText, findByText } = render(
      <ReadingScreen
        route={{ params: { storyId: 'test-story-id' } }}
        navigation={{ navigate: jest.fn() } as any}
      />
    );

    await findByText('Test Story');
    const input = getByText('Start Reading');
    fireEvent.press(input);

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        `reading-progress-${mockStory._id}`,
        expect.any(String)
      );
    });
  });
});
