// /Users/mathewlewallen/ReadVenture/src/screens/WelcomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Button, Appbar } from 'react-native-paper';
import { NavigationProps } from '../navigation';

type WelcomeScreenProps = NavigationProps<'Welcome'>;

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Welcome to ReadVenture!" />
      </Appbar.Header>

      <View style={styles.content}>
        <FontAwesome 
          name="book" 
          size={80} 
          color="#6200ee" 
          style={styles.icon}
        />

        <Text style={styles.welcomeText}>
          Welcome to ReadVenture, the app that helps children learn to read!
        </Text>

        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
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
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
    lineHeight: 32,
  },
  button: {
    width: '80%',
    marginVertical: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
});

export default WelcomeScreen;