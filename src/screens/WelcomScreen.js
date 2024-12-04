import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons/MaterialIcons';
import { FontAwesome } from 'react-native-vector-icons/FontAwesome';
import { Button, Appbar } from 'react-native-paper';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Welcome to ReadVenture!" />
      </Appbar.Header>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          {/* Add a welcome message or description */}
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
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding:
 20,
  },
  welcomeText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    margin: 10,
  },
});

export default WelcomeScreen;