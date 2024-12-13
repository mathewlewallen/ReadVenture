/**
 * Reading Speed Settings Component
 *
 * Allows users to customize their reading speed preferences with
 * real-time preview and persistence. Includes accessibility features
 * and proper state management.
 *
 * @packageDocumentation
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Appbar, Text, Slider, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { NavigationProps } from '../../navigation';
import { updateSettings } from '../../store/settingsSlice';
import { theme } from '../../theme';
import type { RootState } from '../../types';

interface ReadingSpeedSettingsProps
  extends NavigationProps<'ReadingSpeedSettings'> {}

/**
 * Reading speed settings screen component
 */
const ReadingSpeedSettings: React.FC<ReadingSpeedSettingsProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const currentSpeed = useSelector(
    (state: RootState) => state.settings.readingSpeed,
  );

  const [speed, setSpeed] = useState(currentSpeed);
  const [isLoading, setIsLoading] = useState(false);
  const [previewText, setPreviewText] = useState('Sample text for preview');

  /**
   * Saves reading speed setting
   */
  const saveSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem('readingSpeed', speed.toString());
      dispatch(updateSettings({ readingSpeed: speed }));
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save reading speed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [speed, dispatch, navigation]);

  /**
   * Updates preview text animation speed
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setPreviewText(prev => prev.slice(1) + prev[0]);
    }, 1000 / speed);

    return () => clearInterval(timer);
  }, [speed]);

  return (
    <ErrorBoundary>
      <View style={styles.container} testID="reading-speed-settings">
        <Appbar.Header>
          <Appbar.BackAction
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
          />
          <Appbar.Content title="Reading Speed" />
        </Appbar.Header>

        <View style={styles.content}>
          <Text
            style={styles.previewText}
            accessibilityRole="text"
            accessibilityLabel="Preview text with current reading speed"
          >
            {previewText}
          </Text>

          <View style={styles.sliderContainer}>
            <Text style={styles.label}>Speed: {speed} words per minute</Text>
            <Slider
              value={speed}
              onValueChange={setSpeed}
              minimumValue={60}
              maximumValue={300}
              step={10}
              style={styles.slider}
              accessibilityLabel="Reading speed slider"
              accessibilityHint="Adjust reading speed between 60 and 300 words per minute"
              testID="speed-slider"
            />
          </View>

          <Button
            mode="contained"
            onPress={saveSettings}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
            accessibilityLabel="Save settings"
            testID="save-button"
          >
            Save Settings
          </Button>
        </View>
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    marginTop: 32,
    paddingHorizontal: 32,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    padding: 16,
  },
  label: {
    color: theme.colors.text,
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  previewText: {
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
    fontSize: 24,
    marginVertical: 32,
    textAlign: 'center',
  },
  slider: {
    width: '100%',
  },
  sliderContainer: {
    marginVertical: 24,
    width: '100%',
  },
});

export default ReadingSpeedSettings;
