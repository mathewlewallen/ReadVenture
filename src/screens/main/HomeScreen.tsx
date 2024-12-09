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

import React, { useEffect, useCallback } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
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
  const { isLoading } = useSelector((state: RootState) => state.progress);

  // Load initial progress data
  useEffect(() => {
    dispatch(fetchUserProgress());

    return () => {
      // Cleanup subscriptions if needed
    };
  }, [dispatch]);

  /**
   * Navigation handlers with type safety
   */
  const handleNavigate = useCallback(
    (screen: keyof NavigationProps<'Home'>['navigation']) => {
      navigation.navigate(screen);
    },
    [navigation],
  );

  return (
    <ErrorBoundary>
      <View style={styles.container} testID="home-screen">
        <Appbar.Header>
          <Appbar.Content
            title="ReadVenture"
            accessibilityRole="header"
            testID="home-header"
          />
          <Appbar.Action
            icon="settings"
            onPress={() => handleNavigate('Settings')}
            accessibilityLabel="Settings"
            testID="settings-button"
          />
        </Appbar.Header>

        <View style={styles.content}>
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => handleNavigate('StoryLibrary')}
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
            disabled={isLoading}
          >
            Story Library
          </Button>

          <Button
            mode="contained"
            style={styles.button}
            onPress={() => handleNavigate('Progress')}
            icon={() => (
              <MaterialIcons
                name="trending-up"
                size={24}
                color="white"
                accessibilityLabel="Progress icon"
              />
            )}
            accessibilityLabel="View Reading Progress"
            testID="progress-button"
            disabled={isLoading}
          >
            Reading Progress
          </Button>

          {role === 'parent' && (
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => handleNavigate('ParentDashboard')}
              icon={() => (
                <MaterialIcons
                  name="people"
                  size={24}
                  color="white"
                  accessibilityLabel="Dashboard icon"
                />
              )}
              accessibilityLabel="Open Parent Dashboard"
              testID="parent-dashboard-button"
              disabled={isLoading}
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
    padding: 16,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  button: {
    marginVertical: 8,
    padding: 8,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});

export default HomeScreen;
