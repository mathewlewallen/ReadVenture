import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const RegistrationScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [parentEmail, setParentEmail] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:3000/auth/register', { username, password, parentEmail });
      // Store the token securely (e.g., in AsyncStorage)
      console.log('Registration successful:', response.data);
      navigation.navigate('StoryLibrary');
    } catch (error) {
      console.error('Registration error:', error);
      // Display error message to the user
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Parent's Email"
        value={parentEmail}
        onChangeText={setParentEmail}
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  // ... styles for RegistrationScreen
});

export default RegistrationScreen;