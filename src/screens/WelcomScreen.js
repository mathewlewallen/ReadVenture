import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')} // Replace with your logo image
        style={styles.logo}
      />
      <Text style={styles.welcomeText}>Welcome to ReadVenture!</Text>
      <Button
        title="Get Started"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
});

export default WelcomeScreen;