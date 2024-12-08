/*
Generate a complete implementation for this file that:
1. Follows the project's React Native / TypeScript patterns
2. Uses proper imports and type definitions
3. Implements error handling and loading states
4. Includes JSDoc documentation
5. Follows project ESLint/Prettier rules
6. Integrates with existing app architecture
7. Includes proper testing considerations
8. Uses project's defined components and utilities
9. Handles proper memory management/cleanup
10. Follows accessibility guidelines

File requirements:
- Must integrate with Redux store
- Must use React hooks appropriately
- Must handle mobile-specific considerations
- Must maintain type safety
- Must have proper error boundaries
- Must follow project folder structure
- Must use existing shared components
- Must handle navigation properly
- Must scale well as app grows
- Must follow security best practices
*/
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../../services/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Appbar, List, ActivityIndicator, Switch } from 'react-native-paper';
import { NavigationProps } from '../../navigation';
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
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Appbar, List, ActivityIndicator } from 'react-native-paper';

const ParentDashboardScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [childrenData, setChildrenData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const childrenRef = collection(db, 'users');
          const q = query(childrenRef, where('parentEmail', '==', currentUser.email));
          const querySnapshot = await getDocs(q);
          const children = [];
          querySnapshot.forEach((doc) => {
            children.push({ id: doc.id, ...doc.data() });
          });
          setChildrenData(children);
        } catch (error) {
          console.error('Error fetching children data:', error);
          Alert.alert('Error', 'Failed to load children data.');
        } finally {
          setIsLoading(false);
        }
      } else {
        navigation.navigate('Login');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSettingChange = async (settingName, settingValue) => {
    try {
      const userDoc = doc(db, 'users', user.uid);
      await updateDoc(userDoc, {
        settings: {
          [settingName]: settingValue,
        }
      });
      console.log('Setting updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      Alert.alert('Error', 'Failed to update settings.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" testID="loading-indicator" />
      </View>
    );
  }

  if (!user) {
    return <Text>Loading user data...</Text>;
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Parent Dashboard" />
      </Appbar.Header>
      <View style={styles.content}>
        <Text>Username: {user.displayName}</Text>
        <Text>Email: {user.email}</Text>

        <List.Section>
          <List.Item
            title="Sound Effects"
            left={() => <List.Icon icon="volume-high" />}
            right={() => (
              <Switch
                value={soundEffectsEnabled}
                onValueChange={(value) => {
                  setSoundEffectsEnabled(value);
                  handleSettingChange('soundEffectsEnabled', value);
                }}
              />
            )}
          />
        </List.Section>

        {childrenData.map((child) => (
          <View key={child.id} style={styles.childContainer}>
            <Text style={styles.childName}>{child.username}</Text>
            <Text>Words read: {child.progress ? child.progress.wordsRead : 0}</Text>
            <Text>Stories completed: {child.progress ? child.progress.storiesCompleted : 0}</Text>
          </View>
        ))}
      </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  childContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  childName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default ParentDashboardScreen;
