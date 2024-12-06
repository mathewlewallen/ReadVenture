import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../services/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Appbar, List, ActivityIndicator, Switch } from 'react-native-paper';
import { NavigationProps } from '../navigation';
import { ErrorBoundary } from '../components/ErrorBoundary';

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
}

type ParentDashboardProps = NavigationProps<'ParentDashboard'>;

/**
 * Parent dashboard screen component for managing children's reading settings
 * Displays list of children and allows toggling sound effects
 */
const ParentDashboardScreen: React.FC<ParentDashboardProps> = ({ navigation }) => {
  const [childrenData, setChildrenData] = useState<ChildData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChildrenData = useCallback(async (userEmail: string): Promise<void> => {
    if (!userEmail) {
      setError('Invalid user email');
      return;
    }

    try {
      const childrenRef = collection(db, 'users');
      const q = query(childrenRef, where('parentEmail', '==', userEmail));
      const querySnapshot = await getDocs(q);

      const children = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as ChildData[];

      setChildrenData(children);
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`Failed to fetch children data: ${errorMessage}`);
      Alert.alert('Error', 'Failed to fetch children data');
      console.error('Fetch children error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleSoundEffects = useCallback(async (childId: string, enabled: boolean): Promise<void> => {
    if (!childId) return;

    try {
      const childRef = doc(db, 'users', childId);
      await updateDoc(childRef, {
        'settings.soundEffects': enabled,
      });

      setChildrenData(prevData =>
        prevData.map(child =>
          child.id === childId
            ? { ...child, settings: { ...child.settings, soundEffects: enabled } }
            : child
        )
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', 'Failed to update sound effects setting');
      console.error('Toggle sound effects error:', errorMessage);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      if (currentUser?.email) {
        fetchChildrenData(currentUser.email);
      } else {
        navigation.replace('Login');
      }
    });

    return () => unsubscribe();
  }, [navigation, fetchChildrenData]);

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <List.Icon icon="alert" />
        <List.Subheader>{error}</List.Subheader>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <View style={styles.container}></View>
        <Appbar.Header>
          <Appbar.Content title="Parent Dashboard" />
          <Appbar.Action
            icon="cog"
            onPress={() => navigation.navigate('Settings')}
            testID="settings-button"
          />
        </Appbar.Header>

        <View style={styles.content}>
          {childrenData.length === 0 ? (
            <List.Item
              title="No children found"
              description="Add children to manage their settings"
            />
          ) : (
            childrenData.map(child => (
              <List.Item
                key={child.id}
                title={child.username}
                description={`Reading Level: ${child.readingLevel}\nLast Active: ${child.lastActive}`}
                right={() => (
                  <Switch
                    testID={`sound-effects-${child.id}`}
                    value={child.settings.soundEffects}
                    onValueChange={enabled => toggleSoundEffects(child.id, enabled)}
                  />
                )}
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
  },
  content: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ParentDashboardScreen;
