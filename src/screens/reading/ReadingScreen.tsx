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
        const initialText = response.data.text
          .split(/\s+/)
          .slice(0, 10)
          .join(' ');
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
    setTotalWordsRead(prev => prev + correctWords);
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
        <Progress.Bar
          progress={progress}
          width={null}
          style={styles.progressBar}
        />

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
import React, { useState, useEffect } from 'react';
import * as Progress from 'react-native-progress';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import Tts from 'react-native-tts';
import Voice from 'react-native-voice';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
const jaroWinkler = require('jaro-winkler');

const ReadingScreen = ({ route, navigation }) => {
  const { storyId } = route.params;
  const [story, setStory] = useState(null);
  const [currentText, setCurrentText] = useState('');
  const [highlightedWord, setHighlightedWord] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [totalWordsRead, setTotalWordsRead] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get(`/stories/${storyId}`);
        setStory(response.data);
        const initialText = response.data.text
          .split(/\s+/)
          .slice(0, 10)
          .join(' ');
        setCurrentText(initialText);
      } catch (error) {
        console.error('Error fetching story:', error);
        Alert.alert('Error', 'Failed to load the story.');
      }
    };

    fetchStory();
  }, [storyId]);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const storedWordsRead = await AsyncStorage.getItem('totalWordsRead');
        if (storedWordsRead !== null) {
          setTotalWordsRead(parseInt(storedWordsRead, 10));
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    };

    loadProgress();
  }, []);

  useEffect(() => {
    const saveProgress = async () => {
      try {
        await AsyncStorage.setItem('totalWordsRead', totalWordsRead.toString());
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    };

    saveProgress();
  }, [totalWordsRead]);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStartHandler = e => {
    console.log('Speech recognition started.');
    setIsRecording(true);
  };

  const onSpeechEndHandler = e => {
    console.log('Speech recognition ended.');
    setIsRecording(false);
  };

  const onSpeechResultsHandler = e => {
    const spokenText = e.value[0];
    handleReadingInput(spokenText);
  };

  const startRecording = async () => {
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const handleReadingInput = async spokenText => {
    try {
      const response = await axios.post('/analyze', {
        text: spokenText,
        storyId: story._id,
      });
      const adjustedText = response.data.adjustedText;
      setCurrentText(adjustedText);

      const accuracy = calculateAccuracy(spokenText, adjustedText);
      console.log('Accuracy:', accuracy);

      if (accuracy > 0.8) {
        // Update total words read
        setTotalWordsRead(
          prevTotal => prevTotal + adjustedText.split(/\s+/).length,
        );

        setFeedbackText('Great job!');
      } else if (accuracy > 0.5) {
        setFeedbackText('Keep trying!');
      } else {
        setFeedbackText('Try that again.');
      }
    } catch (error) {
      console.error('Error analyzing text:', error);
      Alert.alert('Error', 'There was an error analyzing the text.');
    }
  };

  const calculateAccuracy = (spokenText, expectedText) => {
    const similarity = jaroWinkler(
      spokenText.toLowerCase(),
      expectedText.toLowerCase(),
    );
    return similarity;
  };

  const handlePronunciation = word => {
    Tts.speak(word);
    setHighlightedWord(word);
  };

  const handleNextChunk = () => {
    const words = story.text.split(/\s+/);
    const nextIndex = currentIndex + 10;
    if (nextIndex < words.length) {
      const nextChunk = words.slice(nextIndex, nextIndex + 10).join(' ');
      setCurrentText(nextChunk);
      setCurrentIndex(nextIndex);
    } else {
      navigation.navigate('Progress');
    }
  };

  if (!story) {
    return <Text>Loading story...</Text>;
  }

  return (
    <View style={styles.container}>{/* ... rest of your component ... */}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  storyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  storyText: {
    fontSize: 20,
    lineHeight: 30,
    textAlign: 'center',
  },
  highlighted: {
    backgroundColor: 'yellow',
    fontWeight: 'bold',
  },
  feedback: {
    fontSize: 18,
    color: 'green',
    marginTop: 10,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default ReadingScreen;
