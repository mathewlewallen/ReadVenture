import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const ParentDashboardScreen = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // Retrieve token from storage
        const response = await axios.get('http://localhost:3000/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return <Text>Loading user data...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parent Dashboard</Text>
      <Text>Username: {userData.username}</Text>
      <Text>Email: {userData.parentEmail}</Text>
      {/* ... display other user details and progress tracking */}
    </View>
  );
};

const styles = StyleSheet.create({
  // ... styles for ParentDashboardScreen
});

export default ParentDashboardScreen;