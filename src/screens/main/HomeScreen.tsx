/**
 * Home Screen Component
 *
 * Main dashboard screen that provides navigation to core app features:
 * - Story Library
 * - Reading Progress
 * - Parent Dashboard
 * - Settings
 *
 * @packageDocumentation
 */

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationProps } from '../../navigation';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { theme } from '../../theme';
import { fetchUserProgress } from '../../store/progressSlice';
import type { RootState } from '../../types';

type HomeScreenProps = NavigationProps<'Home'>;

/**
 * Home screen component displaying main navigation options
 */
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { role } = useSelector((state: RootState) => state.auth.user || {});

  useEffect(() => {
    // Fetch initial user progress data
    dispatch(fetchUserProgress());

    return () => {
      // Cleanup subscriptions if needed
    };
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <View style={styles.container} testID="home-screen">
        <Appbar.Header>
          <Appbar.Content title="ReadVenture" accessibilityRole="header" />
          <Appbar.Action
            icon="settings"
            onPress={() => navigation.navigate('Settings')}
            accessibilityLabel="Settings"
            testID="settings-button"
          />
        </Appbar.Header>

        <View style={styles.content}>
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate('StoryLibrary')}
            icon={() => (
              <MaterialIcons
                name="book"
                size={24}
                color="white"
                accessibilityLabel="Book icon"
              />
            )}
            accessibilityLabel="Go to Story Library"
            testID="story-library-button"
          >
            Story Library
          </Button>

          <Button
            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate('Progress')}
            icon={() => (
              <MaterialIcons
                name="analytics"
                size={24}
                color="white"
                accessibilityLabel="Analytics icon"
              />
            )}
            accessibilityLabel="View Reading Progress"
            testID="progress-button"
          >
            Progress
          </Button>

          {role === 'parent' && (
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => navigation.navigate('ParentDashboard')}
              icon={() => (
                <MaterialIcons
                  name="supervisor-account"
                  size={24}
                  color="white"
                  accessibilityLabel="Parent dashboard icon"
                />
              )}
              accessibilityLabel="Go to Parent Dashboard"
              testID="parent-dashboard-button"
            >
              Parent Dashboard
            </Button>
          )}
        </View>
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
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    marginVertical: 10,
    borderRadius: 8,
    paddingVertical: 8,
  },
});

export default HomeScreen;
