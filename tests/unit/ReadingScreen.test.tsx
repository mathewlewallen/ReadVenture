// Unit tests for ReadingScreen component
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import ReadingScreen from '@/screens/ReadingScreen';
import { calculateAccuracy } from '@/screens/ReadingScreen';

// Define navigation types for TypeScript
type RootStackParamList = {
  Reading: { storyId: string };
};

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'Reading',
    undefined
  >;
  route: RouteProp<RootStackParamList, 'Reading'>;
};
// Setup axios mock adapter
const mockAxios = new MockAdapter(axios);

describe('ReadingScreen', () => {
  // Reset state before each test
  beforeEach(async () => {
    await AsyncStorage.clear();
    mockAxios.reset();
  });

  // Test accuracy calculation function
  it('calculates reading accuracy correctly', () => {
    expect(
      calculateAccuracy('the quick brown fox', 'the quick brown fox'),
    ).toBe(1);
    expect(
      calculateAccuracy('the quick brown fox', 'the quick brown fox jumps'),
    ).toBeLessThan(1);
    expect(
      calculateAccuracy('the quick brown fox', 'the slow brown fox'),
    ).toBeGreaterThan(0.5);
  });

  // Test story fetching and display
  it('fetches and displays story content', async () => {
    // Mock API response
    mockAxios.onGet('/stories/test-story-id').reply(200, {
      _id: 'test-story-id',
      title: 'Test Story',
      text: 'This is a test story.',
    });

    const { findByText } = render(
      <ReadingScreen
        route={{
          key: 'reading-screen',
          name: 'Reading',
          params: { storyId: 'test-story-id' },
        }}
        navigation={{ navigate: jest.fn() } as any}
      />,
    );

    // Verify content is displayed
    await findByText('Test Story');
    await findByText('This is a test story.');
  });

  // Test progress updates
  it('updates progress when navigating to the next chunk', async () => {
    const mockStory = {
      _id: 'test-story-id',
      title: 'Test Story',
      text: 'This is a longer test story that will be split into chunks for reading.',
    };

    mockAxios.onGet('/stories/test-story-id').reply(200, mockStory);

    const { getByText, findByText } = render(
      <ReadingScreen
        route={{
          key: 'reading-screen',
          name: 'Reading',
          params: { storyId: 'test-story-id' },
        }}
        navigation={{ navigate: jest.fn() } as any}
      />,
    );

    await findByText('Test Story');
    const nextButton = getByText('Next');
    fireEvent.press(nextButton);

    // Verify progress is saved
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        `reading-progress-${mockStory._id}`,
        expect.any(String),
      );
    });
  });

  // Test error handling
  it('handles API errors gracefully', async () => {
    mockAxios.onGet('/stories/test-story-id').reply(500);

    const { findByText } = render(
      <ReadingScreen
        route={{
          key: 'reading-screen',
          name: 'Reading',
          params: { storyId: 'test-story-id' },
        }}
        navigation={{ navigate: jest.fn() } as any}
      />,
    );

    await findByText('Error loading story');
  });

  // Test AsyncStorage integration
  it('saves reading progress to AsyncStorage', async () => {
    const mockStory = {
      _id: 'test-story-id',
      title: 'Test Story',
      text: 'Test content',
    };

    mockAxios.onGet('/stories/test-story-id').reply(200, mockStory);

    const { getByText, findByText } = render(
      <ReadingScreen
        route={{
          key: 'reading-screen',
          name: 'Reading',
          params: { storyId: 'test-story-id' },
        }}
        navigation={{ navigate: jest.fn() } as any}
      />,
    );

    await findByText('Test Story');
    const startButton = getByText('Start Reading');
    fireEvent.press(startButton);

    // Verify progress storage
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        `reading-progress-${mockStory._id}`,
        expect.any(String),
      );
    });
  });

  // Test text-to-speech functionality
  it('handles text-to-speech correctly', async () => {
    mockAxios.onGet('/stories/test-story-id').reply(200, {
      _id: 'test-story-id',
      title: 'Test Story',
      text: 'This is a test story.',
    });

    const mockTtsSpeak = jest.fn();
    jest.mock('react-native-tts', () => ({
      speak: mockTtsSpeak,
    }));

    const { findByText, getByText } = render(
      <ReadingScreen
        route={{
          key: 'reading-screen',
          name: 'Reading',
          params: { storyId: 'test-story-id' },
        }}
        navigation={
          {
            navigate: jest.fn(),
            dispatch: jest.fn(),
            reset: jest.fn(),
            goBack: jest.fn(),
            isFocused: jest.fn(),
            canGoBack: jest.fn(),
            getParent: jest.fn(),
            getState: jest.fn(),
            getId: jest.fn(),
            addListener: jest.fn(),
            removeListener: jest.fn(),
            replace: jest.fn(),
            push: jest.fn(),
            pop: jest.fn(),
            popToTop: jest.fn(),
          } as any
        }
      />,
    );

    await findByText('This is a test story.');
    fireEvent.press(getByText('Speak'));
    expect(mockTtsSpeak).toHaveBeenCalledWith('This is a test story.');
  });

  // Test speech recognition
  it('handles speech recognition correctly', async () => {
    mockAxios.onGet('/stories/test-story-id').reply(200, {
      _id: 'test-story-id',
      title: 'Test Story',
      text: 'This is a test story.',
    });

    const mockVoiceStart = jest.fn();
    const mockVoiceStop = jest.fn();
    jest.mock('react-native-voice', () => ({
      start: mockVoiceStart,
      stop: mockVoiceStop,
      onSpeechResults: jest.fn(),
    }));

    const { findByText, getByText } = render(
      <ReadingScreen
        route={{
          key: 'reading-screen',
          name: 'Reading',
          params: { storyId: 'test-story-id' },
        }}
        navigation={
          {
            navigate: jest.fn(),
            dispatch: jest.fn(),
            reset: jest.fn(),
            goBack: jest.fn(),
            isFocused: jest.fn(),
            canGoBack: jest.fn(),
            getParent: jest.fn(),
            getState: jest.fn(),
            getId: jest.fn(),
            addListener: jest.fn(),
            removeListener: jest.fn(),
            replace: jest.fn(),
            push: jest.fn(),
            pop: jest.fn(),
            popToTop: jest.fn(),
          } as any
        }
      />,
    );

    await findByText('Test Story');

    // Test recording controls
    fireEvent.press(getByText('Start Recording'));
    expect(mockVoiceStart).toHaveBeenCalled();

    fireEvent.press(getByText('Stop Recording'));
    expect(mockVoiceStop).toHaveBeenCalled();
  });
});
