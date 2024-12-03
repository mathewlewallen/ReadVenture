import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

const SettingsScreen = () => {
  const [soundEnabled, setSoundEnabled] = useState(true); // Example setting

  const toggleSound = () => {
    setSoundEnabled(previousState => !previousState);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Example setting with a Switch component */}
      <View style={styles.settingRow}>
        <Text>Sound Effects</Text>
        <Switch
          value={soundEnabled}
          onValueChange={toggleSound}
        />
      </View>

      {/* Add more settings options here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
});

export default SettingsScreen;