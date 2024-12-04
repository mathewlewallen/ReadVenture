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