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
        <FontAwesome name="book" size={80} color="#6200ee" style={styles.icon} />

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
  button: {
    borderRadius: 8,
    marginVertical: 10,
    paddingVertical: 8,
    width: '80%',
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 20,
  },
  welcomeText: {
    color: '#333',
    fontSize: 24,
    lineHeight: 32,
    marginBottom: 40,
    textAlign: 'center',
  },
});

export default WelcomeScreen;
