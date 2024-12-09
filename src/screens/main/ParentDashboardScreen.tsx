/**
 * Parent Dashboard Screen Component
 *
 * Manages child accounts and their reading settings including:
 * - Sound effects toggle
 * - Text size preferences
 * - Reading speed settings
 *
 * @packageDocumentation
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Appbar, List, ActivityIndicator, Text, Switch } from 'react-native-paper';
import { NavigationProps } from '../../navigation';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { theme } from '../../theme';
import { db } from '../../services/firebase/config';
import type { RootState } from '../../types';

interface Settings {
  soundEffects: boolean;
  textSize: number;
  readingSpeed: number;
}

interface ChildData {
  id: string;
  username: string;
  readingLevel: string;
  lastActive: string;
  settings: Settings;
  progress?: {
    wordsRead: number;
    storiesCompleted: number;
  };
}

type ParentDashboardProps = NavigationProps<'ParentDashboard'>;

/**
 * Parent dashboard screen component
 */
const ParentDashboardScreen: React.FC<ParentDashboardProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [childrenData, setChildrenData] = useState<ChildData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches children data from Firestore
   */
  const fetchChildrenData = useCallback(async () => {
    if (!user?.email) {
      setError('User email not found');
      setIsLoading(false);
      return;
    }

    try {
      const childrenRef = collection(db, 'users');
      const q = query(childrenRef, where('parentEmail', '==', user.email));
      const querySnapshot = await getDocs(q);

      const children = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as ChildData[];

      setChildrenData(children);
      setError(null);
    } catch (err) {
      console.error('Error fetching children:', err);
      setError('Failed to load children data');
      Alert.alert('Error', 'Failed to load children data');
    } finally {
      setIsLoading(false);
    }
  }, [user?.email]);

  /**
   * Updates child settings in Firestore
   */
  const updateChildSettings = async (childId: string, settings: Partial<Settings>) => {
    try {
      const childRef = doc(db, 'users', childId);
      await updateDoc(childRef, { settings });

      setChildrenData(prev =>
        prev.map(child =>
          child.id === childId
            ? { ...child, settings: { ...child.settings, ...settings } }
            : child
        )
      );
    } catch (err) {
      console.error('Error updating settings:', err);
      Alert.alert('Error', 'Failed to update settings');
    }
  };

  useEffect(() => {
    fetchChildrenData();
  }, [fetchChildrenData]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" testID="loading-indicator" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <View style={styles.container} testID="parent-dashboard">
        <Appbar.Header>
          <Appbar.Content title="Parent Dashboard" />
          <Appbar.Action
            icon="refresh"
            onPress={fetchChildrenData}
            accessibilityLabel="Refresh children data"
          />
        </Appbar.Header>

        <View style={styles.content}>
          {error ? (
            <Text
              style={styles.errorText}
              accessibilityRole="alert"
            >
              {error}
            </Text>
          ) : childrenData.length === 0 ? (
            <Text style={styles.emptyText}>No children found</Text>
          ) : (
            childrenData.map((child) => (
              <List.Item
                key={child.id}
                title={child.username}
                description={`Reading Level: ${child.readingLevel}\nLast Active: ${child.lastActive}`}
                left={props => <List.Icon {...props} icon="account-child" />}
                right={() => (
                  <Switch
                    value={child.settings.soundEffects}
                    onValueChange={value =>
                      updateChildSettings(child.id, { soundEffects: value })
                    }
                    accessibilityLabel={`Toggle sound effects for ${child.username}`}
                    testID={`sound-toggle-${child.id}`}
                  />
                )}
                style={styles.childItem}
                onPress={() => navigation.navigate('ChildProgress', { childId: child.id })}
                accessibilityRole="button"
                accessibilityHint={`View progress for ${child.username}`}
              />
            ))
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: theme.colors.text,
  },
  childItem: {
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: theme.colors.surface,
  },
});

export default ParentDashboardScreen;
