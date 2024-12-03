import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Appbar } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="ReadVenture" />
      </Appbar.Header>
      <View style={styles.content}>
        <Button mode="contained" onPress={() => navigation.navigate('StoryLibrary')}>
          Story Library
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate('Progress')}>
          Progress
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate('ParentDashboard')}>
          Parent Dashboard
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate('Settings')}>
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
    padding: 20,
  },
});

export default HomeScreen;