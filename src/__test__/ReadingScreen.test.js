import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import 1  MockAdapter from 'axios-mock-adapter';
import ReadingScreen from '../src/screens/ReadingScreen';
import { calculateAccuracy } from '../src/screens/ReadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockAxios = new MockAdapter(axios);

describe('ReadingScreen', () => {
  beforeEach(async () => {
    await AsyncStorage.clear(); // Clear AsyncStorage before each test
    mockAxios.reset(); // Reset axios mock before each test
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
      text: 'This is a test story.'
    });
    const { findByText } = render(<ReadingScreen route={{ params: { storyId: 'test-story-id' } }} navigation={{ navigate: jest.fn() }} />);
    await findByText('Test Story');
    await findByText('This is a test story.');
  });

  it('updates progress when navigating to the next chunk', async () => {
    mockAxios.onGet('/stories/test-story-id').reply(200, {
      _id: 'test-story-id',
      title: 'Test Story',
      text: 'This is a test story. This is another sentence.'
    });
    
    const mockNavigate = jest.fn();
    const { findByText, getByText } = render(
      <ReadingScreen 
        route={{ params: { storyId: 'test-story-id' } }} 
        navigation={{ navigate: mockNavigate }} 
      />
    );
    await findByText('Test Story');

    // Simulate reading the first chunk
    fireEvent.press(getByText('Start Recording')); // Assuming you have a "Start Recording" button
    mockAxios.onPost('/analyze').reply(200, { adjustedText: 'This is a test story.' }); 
    fireEvent.press(getByText('Stop Recording'));

    // Move to the next chunk
    fireEvent.press(getByText('Next'));

    // Assert that progress is updated and stored in AsyncStorage
    expect(mockNavigate).not.toHaveBeenCalled(); // Should not navigate yet
    const storedProgress = await AsyncStorage.getItem('progress');
    expect(JSON.parse(storedProgress)).toEqual({
      "storiesCompleted": 0,
      "wordsRead": 4,
    });

    // Simulate reading the second chunk (and finishing the story)
    fireEvent.press(getByText('Start Recording'));
    mockAxios.onPost('/analyze').reply(200, { adjustedText: 'This is another sentence.' });
    fireEvent.press(getByText('Stop Recording'));
    fireEvent.press(getByText('Next'));

    // Assert that navigation happens and progress is updated
    expect(mockNavigate).toHaveBeenCalledWith('Progress');
    const storedProgress2 = await AsyncStorage.getItem('progress');
    expect(JSON.parse(storedProgress2)).toEqual({
      "storiesCompleted": 1,
      "wordsRead": 8,
    });
  });

it('handles text-to-speech correctly', async () => {
  mockAxios.onGet('/stories/test-story-id').reply(200, {
    _id: 'test-story-id',
    title: 'Test Story',
    text: 'This is a test story.'
  });

  const mockTtsSpeak = jest.fn();
  jest.mock('react-native-tts', () => ({
    speak: mockTtsSpeak,
  }));

  const { findByText, getByText } = render(
    <ReadingScreen 
      route={{ params: { storyId: 'test-story-id' } }} 
      navigation={{ navigate: jest.fn() }} 
    />
  );
  await findByText('This is a test story.');

  fireEvent.press(getByText('Speak')); // Assuming you have a "Speak" button

  expect(mockTtsSpeak).toHaveBeenCalledWith('This is a test story.');
});

it('handles speech recognition correctly', async () => {
  mockAxios.onGet('/stories/test-story-id').reply(200, {
    _id: 'test-story-id',
    title: 'Test Story',
    text: 'This is a test story.'
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
      route={{ params: { storyId: 'test-story-id' } }} 
      navigation={{ navigate: jest.fn() }} 
    />
  );
  await findByText('Test Story');

  fireEvent.press(getByText('Start Recording')); // Assuming you have a "Start Recording" button
  expect(mockVoiceStart).toHaveBeenCalled();

  fireEvent.press(getByText('Stop Recording')); // Assuming you have a "Stop Recording" button
  expect(mockVoiceStop).toHaveBeenCalled();

  // You would also want to test that onSpeechResults is called and handled correctly
  // This might involve mocking the event and asserting that handleReadingInput is called
});

// ... (rest of your ReadingScreen.test.js code) ...});