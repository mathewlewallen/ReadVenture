import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { MaterialIcons } from 'react-native-vector-icons/MaterialIcons';
import { FontAwesome } from 'react-native-vector-icons/FontAwesome';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Button, Appbar } from 'react-native-paper';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      dispatch(loginStart());

      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      await AsyncStorage.setItem('token', token);
      dispatch(loginSuccess({ user, token }));
      navigation.navigate('Home');
    } catch (error) {
      console.error('Login error:', error);
      dispatch(loginFailure({ error: error.message }));
      Alert.alert('Login Error', 'Invalid username or password.');
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Login" />
      </Appbar.Header>
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={username}
          onChangeText={setUsername}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput

          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}

        />
        <Button
          mode="contained"
          style={styles.button}
          onPress={handleLogin}
          icon={() => <FontAwesome name="sign-in" size={24} color="white" />}
        >
          Login
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('Registration')}
          icon={() => <FontAwesome name="user-plus" size={24} color="white" />}
        >
          Register
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding:
 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,

  },
  button: {
    margin: 10,
  },
});

export default LoginScreen;