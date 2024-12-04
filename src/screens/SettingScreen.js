import React, { useState } from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { Appbar, List, Text, Divider } from 'react-native-paper';

const SettingsScreen = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [textSize, setTextSize] = useState('medium');
  const [readingSpeed, setReadingSpeed] = useState(1);
  const [highlightingColor, setHighlightingColor] = useState('yellow');

  const toggleSound = () => {
    setSoundEnabled(previousState => !previousState);
  };

  const handleTextSizeChange = (size) => {
    setTextSize(size);
  };

  const handleReadingSpeedChange = (speed) => {
    setReadingSpeed(speed);
  };

  const handleHighlightingColorChange = (color) => {
    setHighlightingColor(color);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Settings" />
      </Appbar.Header>

      <List.Section>
        <List.Item
          title="Sound Effects"
          left={() => <List.Icon icon="volume-high" />}
          right={() => <Switch value={soundEnabled} onValueChange={toggleSound} />}
        />
        <Divider />
        <List.Item
          title="Text Size"
          left={() => <List.Icon icon="format-size" />}
          right={() => (
            <List.Icon
              icon="chevron-right"
              onPress={() => navigation.navigate('TextSizeSettings')} // Navigate to a separate screen for text size options
            />
          )}
        />
        <Divider />
        <List.Item
          title="Reading Speed"
          left={() => <List.Icon icon="speedometer" />}
          right={() => (
            <List.Icon
              icon="chevron-right"
              onPress={() => navigation.navigate('ReadingSpeedSettings')} // Navigate to a separate screen for speed settings
            />
          )}
        />
        <Divider />
        <List.Item
          title="Highlighting Color"
          left={() => <List.Icon icon="palette" />}
          right={() => (
            <List.Icon
              icon="chevron-right"
              onPress={() => navigation.navigate('HighlightingColorSettings')} // Navigate to a separate screen for color options
            />
          )}
        />
      </List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SettingsScreen;