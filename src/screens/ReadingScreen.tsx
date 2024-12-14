/**
 * Reading Screen Component
 *
 * Handles interactive reading sessions with voice recognition and progress tracking.
 * Provides real-time feedback and accuracy assessment.
 *
 * @packageDocumentation
 */

import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';
import { jaroWinkler } from 'jaro-winkler';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { Button, Appbar } from 'react-native-paper';
import * as Progress from 'react-native-progress';
import { useDispatch, useSelector } from 'react-redux';

import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { NavigationProps } from '../../navigation';
import { updateProgress } from '../../store/progressSlice';
import { theme } from '../../theme';
import type { RootState } from '../../types';
import { logError } from '../../utils/analytics';

interface Story {
  id: string;
  title: string;
  text: string;
  difficulty: string;
  words?: string[];
}

type ReadingScreenProps = NavigationProps<'Reading'>;

/**
 * Reading screen component for interactive reading sessions
 */
const ReadingScreen: React.FC<ReadingScreenProps> = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { storyId } = route.params;

  // Local state
  const [story, setStory] = useState<Story | null>(null);
  const [currentWord, setCurrentWord] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [wordsRead, setWordsRead] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Redux state
  const settings = useSelector((state: RootState) => state.settings);

  /**
   * Handles speech recognition results
   */
  const handleSpeechResults = useCallback(
    (e: SpeechResultsEvent) => {
      if (e.value && story?.words) {
        const spokenWord = e.value[0].toLowerCase();
        const targetWord = story.words[currentIndex].toLowerCase();
        const similarity = jaroWinkler(spokenWord, targetWord);

        setAccuracy((prevAccuracy) => (prevAccuracy + similarity) / 2);
        setCurrentWord(spokenWord);

        if (similarity > 0.8) {
          setWordsRead((prev) => prev + 1);
          setCurrentIndex((prev) => prev + 1);
          dispatch(
            updateProgress({
              storyId,
              wordsRead: wordsRead + 1,
              accuracy: similarity,
            }),
          );
        }
      }
    },
    [story, currentIndex, dispatch, storyId, wordsRead, updateProgress],
  );

  /**
   * Handles voice recognition errors with retry logic
   */
  const handleError = useCallback(
    async (err: Error, operation: string) => {
      logError(`Reading error: ${operation}`, err);
      setError(err.message);

      if (retryCount < MAX_RETRIES) {
        setRetryCount((prev) => prev + 1);
        // Attempt recovery based on operation type
        switch (operation) {
          case 'voice':
            await initializeVoice();
            break;
          case 'story':
            await loadStory();
            break;
          default:
            break;
        }
      } else {
        Alert.alert(
          'Error',
          'Unable to continue reading session. Please try again later.',
          [{ text: 'OK', onPress: () => navigation.goBack() }],
        );
      }
    },
    [retryCount, navigation, initializeVoice],
  );

  /**
   * Handles voice recognition errors with retry logic
   */
  const handleVoiceError = useCallback(
    async (error: Error) => {
      logError('Voice recognition error:', error);

      if (retryCount < MAX_RETRIES) {
        setRetryCount((prev) => prev + 1);
        await initializeVoice();
      } else {
        Alert.alert(
          'Voice Recognition Error',
          'Unable to continue. Please try again later.',
          [{ text: 'OK', onPress: () => navigation.goBack() }],
        );
      }
    },
    [retryCount, navigation, initializeVoice],
  );

  /**
   * Loads story data with error handling
   */
  const loadStory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/stories/${storyId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch story');
      }

      const data = await response.json();
      setStory({
        ...data,
        words: data.text.split(' '),
      });
    } catch (error) {
      await handleError(error as Error, 'story');
    } finally {
      setIsLoading(false);
    }
  }, [storyId, handleError]);

  /**
   * Initializes voice recognition with error handling
   */
  const initializeVoice = useCallback(async () => {
    try {
      setError(null);
      await Voice.initialize();
      Voice.onSpeechStart = () => setIsRecording(true);
      Voice.onSpeechEnd = () => setIsRecording(false);
      Voice.onSpeechResults = handleSpeechResults;
      Voice.onSpeechError = (e: any) => {
        handleError(
          new Error(e.error?.message || 'Speech recognition failed'),
          'voice',
        );
      };
    } catch (error) {
      await handleError(error as Error, 'voice');
    }
  }, [handleSpeechResults, handleError]);

  /**
   * Starts voice recording
   */
  const startReading = useCallback(async () => {
    try {
      await Voice.start('en-US');
    } catch (error) {
      logError('Voice recording failed', error);
      Alert.alert('Error', 'Failed to start voice recording');
    }
  }, []);

  /**
   * Stops voice recording
   */
  const stopReading = useCallback(async () => {
    try {
      await Voice.stop();
      await Voice.destroy();
    } catch (error) {
      logError('Voice stop failed', error);
    }
  }, []);

  // Initialize voice and fetch story
  useEffect(() => {
    initializeVoice();
    loadStory();

    return () => {
      stopReading();
    };
  }, [storyId, initializeVoice, stopReading]);

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText} accessibilityRole="alert">
            {error}
          </Text>
          <Button
            mode="contained"
            onPress={loadStory}
            style={styles.button}
            disabled={retryCount >= MAX_RETRIES}
            accessibilityLabel="Try again"
          >
            Try Again ({MAX_RETRIES - retryCount} attempts remaining)
          </Button>
        </View>
      </View>
    );
  }

  if (isLoading || !story) {
    return (
      <View style={styles.container}>
        <Progress.Circle size={50} indeterminate />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <View style={styles.container} testID="reading-screen">
        <Appbar.Header>
          <Appbar.BackAction
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
          />
          <Appbar.Content title={story.title} />
        </Appbar.Header>

        <View style={styles.content}>
          <Text style={[styles.word, styles.highlighted]}>
            {story.words?.[currentIndex]}
          </Text>

          <Progress.Bar
            progress={currentIndex / (story.words?.length || 1)}
            width={null}
            style={styles.progressBar}
            accessibilityLabel={`Reading progress: ${Math.round((currentIndex / (story.words?.length || 1)) * 100)}%`}
          />

          <View style={styles.stats}>
            <Text style={styles.statText}>Words Read: {wordsRead}</Text>
            <Text style={styles.statText}>
              Accuracy: {Math.round(accuracy * 100)}%
            </Text>
          </View>

          <Button
            mode="contained"
            onPress={isRecording ? stopReading : startReading}
            style={styles.button}
            loading={isLoading}
            icon={isRecording ? 'stop' : 'microphone'}
            accessibilityLabel={isRecording ? 'Stop reading' : 'Start reading'}
          >
            {isRecording ? 'Stop Reading' : 'Start Reading'}
          </Button>
        </View>
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    marginTop: 20,
    paddingHorizontal: 32,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    padding: 20,
  },
  errorContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  highlighted: {
    backgroundColor: theme.colors.primary + '40',
    borderRadius: 8,
    padding: 10,
  },
  progressBar: {
    marginVertical: 20,
    width: '100%',
  },
  statText: {
    color: theme.colors.text,
    fontSize: 16,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    width: '100%',
  },
  word: {
    fontFamily: theme.fonts.medium,
    fontSize: 32,
    marginVertical: 20,
  },
});

export default ReadingScreen;
