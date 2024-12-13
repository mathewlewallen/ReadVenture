/**
 * Custom hook for managing reading state and interactions
 *
 * Provides reading progress tracking, text analysis, and voice recognition
 * functionality with proper error handling and performance optimization.
 *
 * @packageDocumentation
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateProgress } from '../store/progressSlice';
import type { RootState } from '../types';
import { logError } from '../utils/analytics';

interface UseReadingOptions {
  storyId: string;
  onError?: (error: Error) => void;
}

interface ReadingState {
  currentWord: string;
  wordsRead: number;
  accuracy: number;
  isRecording: boolean;
  error: string | null;
}

/**
 * Hook for managing reading session state and functionality
 */
export const useReading = ({ storyId, onError }: UseReadingOptions) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const voiceRef = useRef<typeof Voice | null>(null);

  // Local state
  const [state, setState] = useState<ReadingState>({
    currentWord: '',
    wordsRead: 0,
    accuracy: 0,
    isRecording: false,
    error: null,
  });

  // Redux state
  const { settings, story } = useSelector((state: RootState) => ({
    settings: state.settings,
    story: state.reading.currentStory,
  }));

  /**
   * Initializes voice recognition
   */
  const initializeVoice = useCallback(async () => {
    try {
      await Voice.initialize();
      voiceRef.current = Voice;

      Voice.onSpeechStart = () => {
        setState(prev => ({ ...prev, isRecording: true }));
      };

      Voice.onSpeechEnd = () => {
        setState(prev => ({ ...prev, isRecording: false }));
      };

      Voice.onSpeechResults = (e: SpeechResultsEvent) => {
        if (e.value?.[0]) {
          handleWordSpoken(e.value[0]);
        }
      };
    } catch (error) {
      handleError(error as Error);
    }
  }, []);

  /**
   * Handles cleanup of voice recognition
   */
  const cleanupVoice = useCallback(async () => {
    if (voiceRef.current) {
      try {
        await Voice.destroy();
        voiceRef.current = null;
      } catch (error) {
        handleError(error as Error);
      }
    }
  }, []);

  /**
   * Starts voice recognition
   */
  const startReading = useCallback(async () => {
    try {
      await Voice.start('en-US');
    } catch (error) {
      handleError(error as Error);
    }
  }, []);

  /**
   * Stops voice recognition
   */
  const stopReading = useCallback(async () => {
    try {
      await Voice.stop();
      await saveProgress();
    } catch (error) {
      handleError(error as Error);
    }
  }, []);

  /**
   * Handles spoken word processing
   */
  const handleWordSpoken = useCallback(
    (word: string) => {
      setState(prev => ({
        ...prev,
        currentWord: word,
        wordsRead: prev.wordsRead + 1,
      }));

      // Update progress in Redux
      dispatch(
        updateProgress({
          storyId,
          wordsRead: state.wordsRead + 1,
          accuracy: calculateAccuracy(word),
        }),
      );
    },
    [dispatch, storyId, state.wordsRead],
  );

  /**
   * Calculates reading accuracy
   */
  const calculateAccuracy = useCallback((spokenWord: string): number => {
    // Implement accuracy calculation logic
    return 0;
  }, []);

  /**
   * Saves reading progress to storage
   */
  const saveProgress = useCallback(async () => {
    try {
      await AsyncStorage.setItem(
        `reading_progress_${storyId}`,
        JSON.stringify({
          wordsRead: state.wordsRead,
          accuracy: state.accuracy,
          timestamp: new Date().toISOString(),
        }),
      );
    } catch (error) {
      handleError(error as Error);
    }
  }, [storyId, state.wordsRead, state.accuracy]);

  /**
   * Handles errors
   */
  const handleError = useCallback(
    (error: Error) => {
      setState(prev => ({ ...prev, error: error.message }));
      logError('Reading Error', error);
      onError?.(error);
    },
    [onError],
  );

  // Initialize voice recognition
  useEffect(() => {
    initializeVoice();
    return () => {
      cleanupVoice();
    };
  }, [initializeVoice, cleanupVoice]);

  return {
    ...state,
    startReading,
    stopReading,
    saveProgress,
  };
};

export default useReading;
