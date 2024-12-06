import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase/config';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Button, Appbar, TextInput } from 'react-native-paper';
import { NavigationProps } from '../navigation';

type RegistrationScreenProps = NavigationProps<'Registration'>;

interface RegistrationForm {
  email: string;
  password: string;
  parentEmail: string;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState<RegistrationForm>({
    email: '',
    password: '',
    parentEmail: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const validateForm = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.email || !formData.password || !formData.parentEmail) {
      Alert.alert('Error', 'All fields are required');
      return false;
    }
    
    if (!emailRegex.test(formData.email) || !emailRegex.test(formData.parentEmail)) {
      Alert.alert('Error', 'Please enter valid email addresses');
      return false;
    }
    
    if (formData.password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return false;
    }
    
    return true;
  };

  const handleRegister = async (): Promise<void> => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      dispatch(loginStart());

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;
      await user.updateProfile({
        displayName: formData.email,
      });

      const token = await user.getIdToken();
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('parentEmail', formData.parentEmail);

      dispatch(loginSuccess({ user, token }));
      navigation.navigate('Home');
    } catch (error) {
      console.error('Registration error:', error);
      dispatch(loginFailure({ error: error.message }));
      Alert.alert('Registration Error', 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Register" />
      </Appbar.Header>

      <View style={styles.content}>
        <TextInput
          label="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="email" />}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          label="Password"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          style={styles.input}
          mode="outlined"
          secureTextEntry={!showPassword}
          left={<TextInput.Icon icon="lock" />}
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />

        <TextInput
          label="Parent's Email"
          value={formData.parentEmail}
          onChangeText={(text) => setFormData({ ...formData, parentEmail: text })}
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="email" />}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Button
          mode="contained"
          onPress={handleRegister}
          style={styles.button}
          loading={isLoading}
          disabled={isLoading}
          icon={() => <FontAwesome name="user-plus" size={24} color="white" />}
        >
          Register
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate('Login')}
          style={styles.linkButton}
        >
          Already have an account? Login
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  linkButton: {
    marginTop: 16,
  },
});

export default RegistrationScreen;