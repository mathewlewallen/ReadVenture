import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { username, password });
      // Store the token securely (e.g., in AsyncStorage)
      console.log('Login successful:', response.data);
      navigation.navigate('StoryLibrary');
    } catch (error) {
      console.error('Login error:', error);
      // Display error message to the user
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      <Button title="Login" onPress={handleLogin} />
      <Button
        title="Register"
        onPress={() => navigation.navigate('Registration')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // ... styles for LoginScreen
});

export default LoginScreen;