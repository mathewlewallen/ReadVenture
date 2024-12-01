import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios'; 1  // Using axios for API requests
import { useNavigation } from '@react-navigation/native';

const StoryLibraryScreen = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/stories'); // Replace with your API URL
        setStories(response.data);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchStories();
  }, []);

    const navigation = useNavigation(); // Get the navigation object

    const renderItem = ({ item }) => (
      <TouchableOpacity style={styles.storyItem} 
        onPress={() => navigation.navigate('Reading', { storyId: item._id })} 
      >
        {/* ... display story details ... */}
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
  // ... other styles
});

export default StoryLibraryScreen;