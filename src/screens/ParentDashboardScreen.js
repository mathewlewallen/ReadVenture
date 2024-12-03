import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ParentDashboardScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [childrenData, setChildrenData] = useState([]);
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(true); // Example setting

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error, e.g., navigate to login screen
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchChildrenData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/parents/children', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChildrenData(response.data);
      } catch (error) {
        console.error('Error fetching children data:', error);
        Alert.alert('Error', 'Failed to load children data.');
      }
    };

    if (userData) { // Only fetch children data after user data is loaded
      fetchChildrenData();
    }
  }, [userData]); // Run this effect whenever userData changes

  const handleSettingChange = async (settingName, settingValue) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post('http://localhost:3000/parents/settings', {
        [settingName]: settingValue
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // You might want to update the local state here or refetch data
      console.log('Setting updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      Alert.alert('Error', 'Failed to update settings.');
    }
  };

  if (!userData) {
    return <Text>Loading user data...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parent Dashboard</Text>
      <Text>Username: {userData.username}</Text>
      <Text>Email: {userData.parentEmail}</Text>

      {/* Display children's progress */}
      {childrenData.map(child => (
        <View key={child._id} style={styles.childContainer}>
          <Text style={styles.childName}>{child.username}</Text>
          {/* Display child's progress details */}
          <Text>Words read: {child.progress.wordsRead}</Text>
          <Text>Stories completed: {child.progress.storiesCompleted}</Text>
          {/* ... other progress details ... */}
        </View>
      ))}

      {/* Settings controls */}
      <View style={styles.settingsContainer}>
        <Text style={styles.settingsTitle}>Settings</Text>
        <View style={styles.settingRow}>
          <Text>Sound Effects</Text>
          <Switch
            value={soundEffectsEnabled}
            onValueChange={(value) => {
              setSoundEffectsEnabled(value);
              handleSettingChange('soundEffectsEnabled', value);
            }}
          />
        </View>
        {/* ... add more settings controls ... */}
      </View>

      {/* Account management */}
      <Button
        title="Add Child"
        onPress={() => navigation.navigate('AddChildScreen')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  settingsContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  }
});

export default ParentDashboardScreen;