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
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Button, Appbar, TextInput } from 'react-native-paper';
import { NavigationProps } from '../navigation';

type LoginScreenProps = NavigationProps<'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const validateForm = (): boolean => {
    if (!username || !password) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return false;
    }
    return true;
  };

  const handleLogin = async (): Promise<void> => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      dispatch(loginStart());

      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password,
      );
      const user = userCredential.user;
      const token = await user.getIdToken();

      await AsyncStorage.setItem('token', token);
      dispatch(loginSuccess({ user, token }));
      navigation.navigate('Home');
    } catch (error) {
      console.error('Login error:', error);
      dispatch(loginFailure({ error: error.message }));
      Alert.alert('Login Error', 'Invalid username or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Login" />
      </Appbar.Header>

      <View style={styles.content}>
        <TextInput
          label="Email"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="email" />}
          autoCapitalize="none"
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="lock" />}
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          loading={isLoading}
          disabled={isLoading}
        >
          Login
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate('Registration')}
          style={styles.linkButton}
        >
          Don't have an account? Register
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    marginTop: 24,
    paddingVertical: 8,
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  linkButton: {
    marginTop: 16,
  },
});

export default LoginScreen;
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import { FontAwesome } from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux';
import { auth } from '../firebaseConfig';
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from '../store/slices/authSlice';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      dispatch(loginStart());

      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password,
      );
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
    padding: 20,
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
