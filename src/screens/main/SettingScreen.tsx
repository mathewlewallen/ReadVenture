/**
 * Settings Screen Component
 *
 * Manages user preferences including:
 * - Sound effects
 * - Text size
 * - Reading speed
 * - Highlighting color
 *
 * @packageDocumentation
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Appbar, List, Text, Divider, Switch } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { theme } from '../../theme';
import { NavigationProps } from '../../navigation';
import { updateSettings } from '../../store/settingsSlice';
import type { RootState } from '../../types';

interface Settings {
  soundEnabled: boolean;
  textSize: 'small' | 'medium' | 'large';
  readingSpeed: number;
  highlightingColor: string;
}

type SettingsScreenProps = NavigationProps<'Settings'>;

/**
 * Settings screen component for managing user preferences
 */
const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const globalSettings = useSelector((state: RootState) => state.settings);
  const [settings, setSettings] = useState<Settings>({
    soundEnabled: true,
    textSize: 'medium',
    readingSpeed: 1,
    highlightingColor: 'yellow',
  });
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Loads user settings from storage
   */
  const loadSettings = useCallback(async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('userSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        dispatch(updateSettings(parsed));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  /**
   * Saves settings to storage and updates global state
   */
  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem('userSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
      dispatch(updateSettings(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  /**
   * Updates individual setting values
   */
  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" testID="settings-loader" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <View style={styles.container} testID="settings-screen">
        <Appbar.Header>
          <Appbar.BackAction
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
          />
          <Appbar.Content title="Settings" />
        </Appbar.Header>

        <List.Section>
          <List.Subheader>Reading Preferences</List.Subheader>
          <List.Item
            title="Sound Effects"
            description="Enable sound effects while reading"
            left={props => <List.Icon {...props} icon="volume-high" />}
            right={() => (
              <Switch
                value={settings.soundEnabled}
                onValueChange={value => updateSetting('soundEnabled', value)}
                accessibilityLabel="Toggle sound effects"
                testID="sound-toggle"
              />
            )}
          />
          <Divider />
          <List.Item
            title="Text Size"
            description={`Current: ${settings.textSize}`}
            left={props => <List.Icon {...props} icon="format-size" />}
            onPress={() => navigation.navigate('TextSizeSettings')}
            accessibilityLabel="Change text size"
            testID="text-size-button"
          />
          <Divider />
          <List.Item
            title="Reading Speed"
            description={`${settings.readingSpeed}x`}
            left={props => <List.Icon {...props} icon="speedometer" />}
            onPress={() => navigation.navigate('ReadingSpeedSettings')}
            accessibilityLabel="Adjust reading speed"
            testID="reading-speed-button"
          />
          <Divider />
          <List.Item
            title="Highlighting Color"
            description={settings.highlightingColor}
            left={props => <List.Icon {...props} icon="palette" />}
            onPress={() => navigation.navigate('HighlightingColorSettings')}
            accessibilityLabel="Choose highlighting color"
            testID="highlight-color-button"
          />
        </List.Section>
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SettingsScreen;
