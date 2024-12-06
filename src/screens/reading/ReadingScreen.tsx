import React, { useState, useEffect } from 'react';
import * as Progress from 'react-native-progress';
import { View, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import Voice from '@react-native-voice/voice';
import { Button, Appbar } from 'react-native-paper';
import { jaroWinkler } from 'jaro-winkler';
import { NavigationProps } from '../navigation';

interface Story {
  id: string;
  title: string;
  text: string;
  difficulty: string;
}

interface VoiceResults {
  value: string[];
}

type ReadingScreenProps = NavigationProps<'Reading'>;

const ReadingScreen: React.FC<ReadingScreenProps> = ({ route, navigation }) => {
  const { storyId } = route.params;
  const [story, setStory] = useState<Story | null>(null);
  const [currentText, setCurrentText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [totalWordsRead, setTotalWordsRead] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const initializeVoice = async () => {
      try {
        await Voice.initialize();
        Voice.onSpeechStart = () => setIsRecording(true);
        Voice.onSpeechEnd = () => setIsRecording(false);
        Voice.onSpeechResults = handleSpeechResults;
      } catch (error) {
        console.error('Error initializing voice:', error);
        Alert.alert('Error', 'Failed to initialize voice recognition');
      }
    };

    initializeVoice();
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get<Story>(`/stories/${storyId}`);
        setStory(response.data);
        const initialText = response.data.text.split(/\s+/).slice(0, 10).join(' ');
        setCurrentText(initialText);
      } catch (error) {
        console.error('Error fetching story:', error);
        Alert.alert('Error', 'Failed to load the story');
      }
    };

    fetchStory();
  }, [storyId]);

  const handleSpeechResults = (results: VoiceResults) => {
    const spokenText = results.value[0];
    const words = currentText.split(/\s+/);
    const spokenWords = spokenText.split(/\s+/);

    let correctWords = 0;
    words.forEach((word, index) => {
      if (
        spokenWords[index] &&
        jaroWinkler(word.toLowerCase(), spokenWords[index].toLowerCase()) > 0.8
      ) {
        correctWords++;
      }
    });

    const accuracy = (correctWords / words.length) * 100;
    setTotalWordsRead((prev) => prev + correctWords);
    setProgress(totalWordsRead / (story?.text.split(/\s+/).length || 1));

    if (accuracy > 80) {
      moveToNextSection();
      setFeedbackText('Great job! Moving to next section.');
    } else {
      setFeedbackText('Try reading that section again.');
    }
  };

  const startRecording = async () => {
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.error('Error starting voice recording:', error);
      Alert.alert('Error', 'Failed to start voice recording');
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error('Error stopping voice recording:', error);
      Alert.alert('Error', 'Failed to stop voice recording');
    }
  };

  const moveToNextSection = () => {
    if (!story) return;

    const words = story.text.split(/\s+/);
    const nextIndex = currentIndex + 10;
    if (nextIndex >= words.length) {
      Alert.alert('Congratulations!', 'You have finished the story!');
      navigation.goBack();
      return;
    }

    const nextText = words.slice(nextIndex, nextIndex + 10).join(' ');
    setCurrentText(nextText);
    setCurrentIndex(nextIndex);
  };

  if (!story) {
    return (
      <View style={styles.loadingContainer}>
        <Progress.Circle size={50} indeterminate />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={story.title} />
      </Appbar.Header>

      <View style={styles.content}>
        <Progress.Bar progress={progress} width={null} style={styles.progressBar} />

        <Text style={styles.text}>{currentText}</Text>

        <Text style={styles.feedback}>{feedbackText}</Text>

        <Button
          mode="contained"
          onPress={isRecording ? stopRecording : startRecording}
          style={styles.button}
          icon={isRecording ? 'stop' : 'microphone'}
        >
          {isRecording ? 'Stop Reading' : 'Start Reading'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  feedback: {
    color: '#666',
    fontSize: 16,
    marginVertical: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  progressBar: {
    marginVertical: 16,
  },
  text: {
    fontSize: 24,
    lineHeight: 36,
    marginVertical: 16,
  },
});

export default ReadingScreen;
