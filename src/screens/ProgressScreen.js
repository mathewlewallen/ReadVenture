import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressScreen = () => {
  // You'll need to fetch and display the actual progress data here
  // (e.g., from your Redux store or an API call)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress</Text>

      {/* Examples of how to display progress data */}
      <Text>Words read: {/* Display words read count */}</Text>
      <Text>Stories completed: {/* Display stories completed count */}</Text>

      {/* You can use components from react-native-progress or other libraries 
          to create visual progress indicators (bars, charts, etc.) */}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default ProgressScreen;