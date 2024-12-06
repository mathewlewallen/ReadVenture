import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, List, Text, Divider, Switch } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProps } from '../navigation';

interface Settings {
  soundEnabled: boolean;
  textSize: 'small' | 'medium' | 'large';
  readingSpeed: number;
  highlightingColor: string;
}

type SettingsScreenProps = NavigationProps<'Settings'>;

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [settings, setSettings] = useState<Settings>({
    soundEnabled: true,
    textSize: 'medium',
    readingSpeed: 1,
    highlightingColor: 'yellow',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('userSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem('userSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateSettings = (key: keyof Settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Settings" />
      </Appbar.Header>

      <List.Section>
        <List.Item
          title="Sound Effects"
          left={() => <List.Icon icon="volume-high" />}
          right={() => (
            <Switch
              value={settings.soundEnabled}
              onValueChange={(value) => updateSettings('soundEnabled', value)}
            />
          )}
        />
        <Divider />

        <List.Item
          title="Text Size"
          left={() => <List.Icon icon="format-size" />}
          right={() => (
            <View style={styles.textSizeContainer}>
              {['small', 'medium', 'large'].map((size) => (
                <Text
                  key={size}
                  style={[
                    styles.textSizeOption,
                    settings.textSize === size && styles.selectedOption,
                  ]}
                  onPress={() => updateSettings('textSize', size)}
                >
                  {size.charAt(0).toUpperCase()}
                </Text>
              ))}
            </View>
          )}
        />
        <Divider />

        <List.Item
          title="Reading Speed"
          left={() => <List.Icon icon="speedometer" />}
          right={() => (
            <View style={styles.speedContainer}>
              {[0.5, 1, 1.5, 2].map((speed) => (
                <Text
                  key={speed}
                  style={[
                    styles.speedOption,
                    settings.readingSpeed === speed && styles.selectedOption,
                  ]}
                  onPress={() => updateSettings('readingSpeed', speed)}
                >
                  {speed}x
                </Text>
              ))}
            </View>
          )}
        />
        <Divider />

        <List.Item
          title="Highlighting Color"
          left={() => <List.Icon icon="palette" />}
          right={() => (
            <View style={styles.colorContainer}>
              {['yellow', 'green', 'blue', 'pink'].map((color) => (
                <View
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    settings.highlightingColor === color && styles.selectedColor,
                  ]}
                  onTouchEnd={() => updateSettings('highlightingColor', color)}
                />
              ))}
            </View>
          )}
        />
      </List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  colorContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  colorOption: {
    borderRadius: 12,
    height: 24,
    width: 24,
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  selectedColor: {
    borderColor: '#000',
    borderWidth: 2,
  },
  selectedOption: {
    backgroundColor: '#e0e0e0',
  },
  speedContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  speedOption: {
    borderRadius: 4,
    padding: 8,
  },
  textSizeContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  textSizeOption: {
    borderRadius: 4,
    padding: 8,
  },
});

export default SettingsScreen;
