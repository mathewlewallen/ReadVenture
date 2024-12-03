import React, { useState, useEffect, useRef } from 'react';
import * as Progress from 'react-native-progress';
import { View, Text, StyleSheet, TouchableOpacity, Button, Alert } from 'react-native';
import axios from 'axios';
import Tts from 'react-native-tts';
import Voice from 'react-native-voice';

const ReadingScreen = ({ route, navigation }) => {
    const { storyId } = route.params;
    const [story, setStory] = useState(null);
    const [currentText, setCurrentText] = useState('');
    const [highlightedWord, setHighlightedWord] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [progress, setProgress] = useState(0);
    const [wordsRead, setWordsRead] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [feedbackText, setFeedbackText] = useState('');
    // ... other state variables you might need for animations, rewards, etc.

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/stories/${storyId}`);
                setStory(response.data);
                const initialText = response.data.text.split(/\s+/).slice(0, 10).join(' ');
                setCurrentText(initialText);
            } catch (error) {
                console.error('Error fetching story:', error);
                Alert.alert('Error', 'Failed to load the story.');
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

            // Logic to update progress, words read, and current index (moved from here) 
            
            // Example feedback logic (replace with your actual feedback mechanism)
            const accuracy = calculateAccuracy(spokenText, adjustedText); // You'll need to implement this
            if (accuracy > 0.8) {
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

    const handlePronunciation = (word) => {
        Tts.speak(word);
        setHighlightedWord(word);
    };

    const handleNextChunk = () => {
        // Logic to move to the next chunk of text
        const words = story.text.split(/\s+/);
        const nextIndex = currentIndex + 10;
        if (nextIndex < words.length) {
            const nextChunk = words.slice(nextIndex, nextIndex + 10).join(' ');
            setCurrentText(nextChunk);
            setCurrentIndex(nextIndex);

            // Update progress and words read here
            const newWordsRead = nextIndex; // Since we're moving to the next chunk
            setWordsRead(newWordsRead);
            setProgress(newWordsRead / words.length);
        } else {
            // Handle end of story (navigate to progress screen)
            navigation.navigate('ProgressScreen'); // Replace 'ProgressScreen' with your actual screen name
        }
    };

    if (!story) {
        return <Text>Loading story...</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.storyTitle}>{story.title}</Text>
            <Progress.Bar
                progress={progress}
                width={300}
            />
            <Text style={styles.storyText}>
                {currentText.split(/\s+/).map((word, index) => (
                    <TouchableOpacity key={index} onPress={() => handlePronunciation(word)}>
                        <Text style={highlightedWord === word ? styles.highlighted : null}>
                            {word}{' '}
                        </Text>
                    </TouchableOpacity>
                ))}
            </Text>

            {/* Display feedback */}
            <Text style={styles.feedback}>{feedbackText}</Text>

            <View style={styles.controls}>
                <Button
                    title={isRecording ? 'Stop Recording' : 'Start Recording'}
                    onPress={isRecording ? Voice.stop : startRecording}
                />
                <Button title="Next" onPress={handleNextChunk} />
            </View>
            {/* ... other UI elements you might want to add ... */}
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
    feedback: {
        fontSize: 18,
        color: 'green', // Or any color you prefer for feedback
        marginTop: 10,
        textAlign: 'center',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    // ... other styles
});

export default ReadingScreen;