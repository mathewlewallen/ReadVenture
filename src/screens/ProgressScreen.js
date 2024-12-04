import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appbar, ProgressBar } from 'react-native-paper';

const ProgressScreen = () => {
  const [progress, setProgress] = useState({
    totalWordsRead: 0,
    storiesCompleted: 0,
    badgesEarned: [],
  });

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const storedProgress = await AsyncStorage.getItem('progress');
        if (storedProgress !== null) {
          setProgress(JSON.parse(storedProgress));
        }
        const storedTotalWordsRead = await AsyncStorage.getItem('totalWordsRead');
        if (storedTotalWordsRead !== null) {
          setProgress(prevProgress => ({
            ...prevProgress,
            totalWordsRead: parseInt(storedTotalWordsRead, 10),
          }));
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    };

    loadProgress();
  }, []);

  const calculateProgress = () => {
    const totalWordsPossible = 10000; // Example value, adjust as needed
    const progressPercentage = (progress.totalWordsRead / totalWordsPossible) * 100;
    return progressPercentage;
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Progress" />
      </Appbar.Header>
      <View style={styles.content}>
        <Text style={styles.title}>Your Progress</Text>
        <ProgressBar progress={calculateProgress() / 100} color="blue" testID="progress-bar" />
        <Text>Total words read: {progress.totalWordsRead}</Text>
        <Text>Stories completed: {progress.storiesCompleted}</Text>
        <Text>Badges Earned:</Text>
        {progress.badgesEarned.map((badge, index) => (
          <Text key={index}>{badge}</Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default ProgressScreen;