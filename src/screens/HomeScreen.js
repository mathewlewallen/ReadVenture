import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Appbar } from 'react-native-paper';
import { MaterialIcons } from 'react-native-vector-icons/MaterialIcons';
import { FontAwesome } from 'react-native-vector-icons/FontAwesome';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="ReadVenture" />
      </Appbar.Header>
      <View style={styles.content}>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('StoryLibrary')}
          icon={() => <MaterialIcons name="book" size={24} color="white" />}
        >
          Story Library
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('Progress')}
          icon={() => <MaterialIcons name="analytics" size={24} color="white" />}
        >
          Progress
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('ParentDashboard')}
          icon={() => <MaterialIcons name="dashboard" size={24} color="white" />}
        >
          Parent Dashboard
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('Settings')}
          icon={() => <MaterialIcons name="settings" size={24} color="white" />}
        >
          Settings
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
  button: {
    margin: 10,
  },
});

export default HomeScreen;