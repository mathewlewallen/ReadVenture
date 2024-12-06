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
