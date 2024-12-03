import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const StoryLibraryScreen = () => {
  const [stories, setStories] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/stories');
        setStories(response.data);
      } catch (error) {
        console.error('Error fetching stories:', error);
        Alert.alert('Error', 'Failed to load stories.'); // Display error message
      }
    };

    fetchStories();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.storyItem}
      onPress={() => navigation.navigate('Reading', { storyId: item._id })}
    >
      <Text style={styles.storyTitle}>{item.title}</Text>
      {/* ... display other story details (e.g., author, difficulty) ... */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
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
    padding: 20,
  },
  storyItem: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // ... other styles you might need for story details
});

export default StoryLibraryScreen;