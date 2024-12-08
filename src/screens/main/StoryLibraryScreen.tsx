/**
 * Story Library Screen Component
 *
 * Displays a list of available stories for reading, with filtering and sorting options.
 * Handles story selection, loading states, and navigation to reading screen.
 *
 * @packageDocumentation
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Appbar, List, Text } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationProps } from '../../navigation';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { theme } from '../../theme';
import { fetchStories } from '../../store/storySlice';
import type { Story, RootState } from '../../types';

interface StoryLibraryScreenProps extends NavigationProps<'StoryLibrary'> {}

/**
 * Story Library Screen component
 * Displays available stories and handles story selection
 */
const StoryLibraryScreen: React.FC<StoryLibraryScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const { stories, isLoading, error } = useSelector(
    (state: RootState) => state.stories,
  );
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Fetches stories from the API
   */
  const loadStories = useCallback(async () => {
    try {
      await dispatch(fetchStories());
    } catch (err) {
      console.error('Error loading stories:', err);
      Alert.alert('Error', 'Failed to load stories. Please try again.');
    }
  }, [dispatch]);

  useEffect(() => {
    loadStories();

    return () => {
      // Cleanup if needed
    };
  }, [loadStories]);

  /**
   * Handles pull-to-refresh
   */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadStories();
    setRefreshing(false);
  }, [loadStories]);

  /**
   * Renders individual story item
   */
  const renderStoryItem = useCallback(
    ({ item }: { item: Story }) => (
      <List.Item
        title={item.title}
        description={item.description}
        left={props => (
          <FontAwesome
            {...props}
            name="book"
            size={24}
            color={theme.colors.primary}
            accessibilityLabel={`Book icon for ${item.title}`}
          />
        )}
        right={props => (
          <List.Icon
            {...props}
            icon="chevron-right"
            accessibilityLabel="Navigate to story"
          />
        )}
        onPress={() => navigation.navigate('Reading', { storyId: item._id })}
        accessibilityRole="button"
        accessibilityHint={`Navigate to read ${item.title}`}
        testID={`story-item-${item._id}`}
        style={styles.storyItem}
      />
    ),
    [navigation],
  );

  if (isLoading && !refreshing) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Story Library" />
        </Appbar.Header>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" testID="loading-indicator" />
        </View>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <View style={styles.container} testID="story-library-screen">
        <Appbar.Header>
          <Appbar.BackAction
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
          />
          <Appbar.Content title="Story Library" />
        </Appbar.Header>

        <FlatList
          data={stories}
          renderItem={renderStoryItem}
          keyExtractor={item => item._id}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome name="inbox" size={48} color={theme.colors.text} />
              <Text style={styles.emptyText}>
                {error || 'No stories available'}
              </Text>
            </View>
          }
          accessibilityRole="list"
          accessibilityLabel="List of available stories"
          testID="story-list"
        />
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flexGrow: 1,
  },
  storyItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
  },
});

export default StoryLibraryScreen;
