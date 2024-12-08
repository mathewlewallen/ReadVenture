/**
 * Progress Screen Component
 *
 * Displays user's reading progress including:
 * - Total words read
 * - Stories completed
 * - Badges earned
 * - Progress visualization
 *
 * @packageDocumentation
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Appbar, Text, Card, List } from 'react-native-paper';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { ProgressBar } from '../../components/reading/ProgressBar';
import { NavigationProps } from '../../navigation';
import { theme } from '../../theme';
import { fetchUserProgress } from '../../store/progressSlice';
import type { RootState, UserProgress } from '../../types';

interface ProgressScreenProps extends NavigationProps<'Progress'> {}

/**
 * Progress screen component
 */
const ProgressScreen: React.FC<ProgressScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { progress, isLoading, error } = useSelector(
    (state: RootState) => state.progress
  );
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProgress();

    return () => {
      // Cleanup if needed
    };
  }, [dispatch]);

  /**
   * Loads user progress data from Redux/API
   */
  const loadProgress = async () => {
    try {
      await dispatch(fetchUserProgress());
    } catch (err) {
      console.error('Error loading progress:', err);
    }
  };

  /**
   * Calculates percentage completion
   */
  const calculateProgress = (): number => {
    const totalWordsPossible = 10000; // Example value
    return Math.min((progress.totalWordsRead / totalWordsPossible) * 100, 100);
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Progress" />
        </Appbar.Header>
        <View style={styles.content}>
          <Text
            style={styles.errorText}
            accessibilityRole="alert"
          >
            {error}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <View style={styles.container} testID="progress-screen">
        <Appbar.Header>
          <Appbar.BackAction 
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
          />
          <Appbar.Content title="Your Progress" />
        </Appbar.Header>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
        >
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>Overall Progress</Text>
              <ProgressBar 
                progress={calculateProgress() / 100}
                color={theme.colors.primary}
                testID="progress-bar"
              />
              <Text style={styles.progressText}>
                {`${Math.round(calculateProgress())}% Complete`}
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <List.Item
                title="Total Words Read"
                description={progress.totalWordsRead.toString()}
                left={props => <List.Icon {...props} icon="book" />}
                accessibilityRole="text"
              />
              <List.Item
                title="Stories Completed"
                description={progress.storiesCompleted.toString()}
                left={props => <List.Icon {...props} icon="check-circle" />}
                accessibilityRole="text"
              />
            </Card.Content>
          </Card>

          {progress.badges.length > 0 && (
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.subtitle}>Badges Earned</Text>
                {progress.badges.map((badge, index) => (
                  <List.Item
                    key={badge.id}
                    title={badge.name}
                    description={badge.description}
                    left={props => <List.Icon {...props} icon="trophy" />}
                    accessibilityRole="text"
                  />
                ))}
              </Card.Content>
            </Card>
          )}
        </ScrollView>
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: theme.fonts.medium,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: theme.fonts.medium,
    marginBottom: 12,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 8,
    color: theme.colors.primary,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
    margin: 16,
  },
});

export default ProgressScreen;
