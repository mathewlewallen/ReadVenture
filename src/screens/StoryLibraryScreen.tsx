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

import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { NavigationProps } from '../../navigation';
import { fetchStories } from '../../store/storySlice';
import { theme } from '../../theme';
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
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    color: theme.colors.text,
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  listContainer: {
    flexGrow: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  storyItem: {
    borderBottomColor: theme.colors.text,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default StoryLibraryScreen;
