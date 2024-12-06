// /Users/mathewlewallen/ReadVenture/src/screens/StoryLibraryScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { NavigationProps } from '../navigation';
import { Appbar, List, ActivityIndicator } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { API_URL } from '../config';

interface Story {
  _id: string;
  title: string;
  author: string;
  difficulty: string;
  coverImage?: string;
  description: string;
}

type StoryLibraryScreenProps = NavigationProps<'StoryLibrary'>;

const StoryLibraryScreen: React.FC<StoryLibraryScreenProps> = ({ navigation }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get<Story[]>(`${API_URL}/stories`);
        setStories(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching stories:', error);
        setError('Failed to load stories');
        Alert.alert('Error', 'Failed to load stories.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, []);

  const handleStorySelect = (storyId: string) => {
    navigation.navigate('Reading', { storyId });
  };

  const renderStoryItem = ({ item }: { item: Story }) => (
    <List.Item
      title={item.title}
      description={`By ${item.author} • ${item.difficulty}`}
      left={props => 
        item.coverImage ? (
          <List.Image {...props} source={{ uri: item.coverImage }} />
        ) : (
          <FontAwesome name="book" size={24} color="#666" />
        )
      }
      onPress={() => handleStorySelect(item._id)}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Story Library" />
        </Appbar.Header>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Story Library" />
      </Appbar.Header>
      <FlatList
        data={stories}
        renderItem={renderStoryItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome name="inbox" size={48} color="#666" />
            <List.Subheader>
              {error || 'No stories available'}
            </List.Subheader>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default StoryLibraryScreen;