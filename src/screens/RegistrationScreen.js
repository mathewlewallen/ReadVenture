import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { MaterialIcons } from 'react-native-vector-icons/MaterialIcons';
import { FontAwesome } from 'react-native-vector-icons/FontAwesome';
import { Button, Appbar } from 'react-native-paper';

const RegistrationScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const dispatch = useDispatch();

  const handleRegister = async () => {
    try {
      dispatch(loginStart());
      const userCredential = await createUserWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;

      // Optionally update user profile (e.g., with parentEmail)
      // await user.updateProfile({ displayName: username, email: parentEmail }); 

      const token = await user.getIdToken();
      await AsyncStorage.setItem('token', token);
      dispatch(loginSuccess({ user, token }));
      navigation.navigate('Home');
    } catch (error) {
      console.error('Registration error:', error);
      dispatch(loginFailure({ error: error.message }));
      Alert.alert('Registration Error', 'An error occurred during registration.');
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Register" />
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
        <TextInput
          style={styles.input}
          placeholder="Parent's
 Email"
          value={parentEmail}
          onChangeText={setParentEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Button
          mode="contained"
          style={styles.button}
          onPress={handleRegister}
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

export default RegistrationScreen;