import React, { useState, useEffect, useRef } from 'react';
import * as Progress from 'react-native-progress';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Tts from 'react-native-tts';

const ReadingScreen = ({ route }) => {
  const { storyId } = route.params; // Get the story ID from the navigation params
  const [story, setStory] = useState(null);
  const [currentText, setCurrentText] = useState(''); // Text to be displayed
  const [highlightedWord, setHighlightedWord] = useState(''); 

  const handlePronunciation = (word) => {
    Tts.speak(word);
    setHighlightedWord(word); // Highlight the word being pronounced
  };

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/stories/${storyId}`);
        setStory(response.data);
        setCurrentText(response.data.text); // Initially set to the full text
      } catch (error) {
        console.error('Error fetching story:', error);
      }
    };

    fetchStory();
  }, [storyId]);

  // Function to handle the child's reading input (we'll implement this later)
  const handleReadingInput = async (spokenText) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/analyze', // Replace with your API endpoint
        { text: spokenText, storyId: story._id }, 
      );
      setCurrentText(response.data.adjustedText); 
    } catch (error) {
      console.error('Error analyzing text:', error);
    }
  };
  

  if (!story) {
    return <Text>Loading story...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.storyTitle}>{story.title}</Text>

      <Text style={styles.storyText}>
        {currentText.split(' ').map((word, index) => (
          <TouchableOpacity key={index} onPress={() => handlePronunciation(word)}>
            <Text style={highlightedWord === word ? styles.highlighted : null}>
              {word}{' '}
            </Text>
          </TouchableOpacity>
        ))}
      </Text>

      <Progress.Bar
        progress={0.5} // Calculate progress dynamically
        width={300}
      />

      {/* ... other UI elements (navigation buttons, feedback animations, etc.) */}
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
  },
  // ... other styles
});

export default ReadingScreen;