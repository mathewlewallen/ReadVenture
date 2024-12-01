import React, { useState, useEffect } from 'react';
import * as Progress from 'react-native-progress';
import { View, Text, StyleSheet, TouchableOpacity, Button, Alert } from 'react-native';
import axios from 'axios';
import Tts from 'react-native-tts';
import Voice from 'react-native-voice';

const ReadingScreen = ({ route }) => {
  const { storyId } = route.params;
  const [story, setStory] = useState(null);
  const [currentText, setCurrentText] = useState('');
  const [highlightedWord, setHighlightedWord] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [wordsRead, setWordsRead] = useState(0);

  const handlePronunciation = (word) => {
    Tts.speak(word);
    setHighlightedWord(word);
  };

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/stories/${storyId}`);
        setStory(response.data);
        setCurrentText(response.data.text);
      } catch (error) {
        console.error('Error fetching story:', error);
      }
    };

    fetchStory();
  }, [storyId]);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStartHandler = (e) => {
    console.log('Speech recognition started.');
    setIsRecording(true);
  };

  const onSpeechEndHandler = (e) => {
    console.log('Speech recognition ended.');
    setIsRecording(false);
  };

  const onSpeechResultsHandler = (e) => {
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

  const handleReadingInput = async (spokenText) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/analyze', 
        { text: spokenText, storyId: story._id }, 
      );

      const adjustedText = response.data.adjustedText;
      setCurrentText(adjustedText);
      const newWordsRead = adjustedText.split(/\s+/).length;
      setWordsRead(newWordsRead);
      setProgress(newWordsRead / story.text.split(/\s+/).length);
    } catch (error) {
      console.error('Error analyzing text:', error);
      Alert.alert('Error', 'There was an error analyzing the text.');
    }
  };

  if (!story) {
    return <Text>Loading story...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.storyTitle}>{story.title}</Text>
      <Text style={styles.storyText}>
        {currentText.split(/\s+/).map((word, index) => (
          <TouchableOpacity key={index} onPress={() => handlePronunciation(word)}>
            <Text style={highlightedWord === word ? styles.highlighted : null}>
              {word}{' '}
            </Text>
          </TouchableOpacity>
        ))}
      </Text>
      
      <Progress.Bar
        progress={progress} 
        width={300}
      />

      <Button 
        title={isRecording ? 'Stop Recording' : 'Start Recording'} 
        onPress={startRecording} 
      />

      {/* ... other UI elements (pronunciation button, navigation, etc.) */}
    </View>
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
  // ... other styles
});

export default ReadingScreen;