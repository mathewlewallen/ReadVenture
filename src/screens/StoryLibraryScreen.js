// StoryLibraryScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Appbar, List, ActivityIndicator } from 'react-native-paper';
import { FontAwesome } from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const StoryLibraryScreen = () => {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get('http://your-api-url/stories'); // Replace with your API URL
        setStories(response.data);
      } catch (error) {
        console.error('Error fetching stories:', error);
        Alert.alert('Error', 'Failed to load stories.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.storyItem}
      onPress={() => navigation.navigate('Reading', { storyId: item._id })}
    >
      <FontAwesome name="book" size={24} color="blue" />
      <Text style={styles.storyTitle}>{item.title}</Text>
      {/* ... display other story details (e.g., author, difficulty) ... */}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Story Library" />
      </Appbar.Header>
      <FlatList
        data={stories}
        renderItem={renderItem}
        keyExtractor={item => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  storyItem: {
    flexDirection: 'row', // Arrange icon and text in a row
    alignItems: 'center', // Center vertically
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  storyTitle: {
    fontSize: 18,
    marginLeft: 10, // Add some space between the icon and text
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StoryLibraryScreen;