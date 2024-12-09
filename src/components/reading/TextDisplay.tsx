/**
 * TextDisplay Component
 *
 * A reusable component for displaying interactive text content with word highlighting
 * and touch interaction support. Optimized for mobile devices and accessibility.
 *
 * @packageDocumentation
 */

import React, { useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  AccessibilityInfo,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { theme } from '../../theme';
import type { RootState } from '../../types';

interface TextDisplayProps {
  /** Text content to display */
  text: string;
  /** Currently highlighted word */
  highlightedWord?: string;
  /** Font size override */
  fontSize?: number;
  /** Callback when word is pressed */
  onWordPress?: (word: string) => void;
  /** Test ID for component */
  testID?: string;
}

/**
 * Text display component with word highlighting and interaction
 */
export const TextDisplay: React.FC<TextDisplayProps> = ({
  text,
  highlightedWord,
  fontSize = 20,
  onWordPress,
  testID = 'text-display',
}) => {
  // Get theme settings from Redux
  const { fontFamily, textColor } = useSelector(
    (state: RootState) => state.settings,
  );

  // Memoize word splitting for performance
  const words = useMemo(() => text.split(' '), [text]);

  /**
   * Handles word press with accessibility announcement
   */
  const handleWordPress = useCallback(
    (word: string) => {
      if (onWordPress) {
        onWordPress(word);
        // Announce word selection for screen readers
        AccessibilityInfo.announceForAccessibility(`Selected word: ${word}`);
      }
    },
    [onWordPress],
  );

  return (
    <ErrorBoundary>
      <View
        style={styles.container}
        testID={testID}
        accessibilityRole="text"
        accessible={true}
        accessibilityLabel={text}
      >
        {words.map((word, index) => (
          <Text
            key={`${word}-${index}`}
            style={[
              styles.word,
              {
                fontSize,
                fontFamily,
                color: textColor || theme.colors.text,
              },
              word === highlightedWord && styles.highlighted,
            ]}
            onPress={() => handleWordPress(word)}
            accessibilityRole="button"
            accessibilityLabel={`Word: ${word}`}
            accessibilityHint={`Tap to select word ${word}`}
            testID={`word-${index}`}
          >
            {word}
            {index < words.length - 1 ? ' ' : ''}
          </Text>
        ))}
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    ...Platform.select({
      ios: {
        paddingTop: 8, // Adjust for iOS touch targets
      },
      android: {
        paddingTop: 4, // Adjust for Android touch targets
      },
    }),
  },
  word: {
    marginRight: 4,
    marginVertical: 2,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
    ...Platform.select({
      ios: {
        minHeight: 44, // iOS accessibility minimum
      },
      android: {
        minHeight: 48, // Android accessibility minimum
      },
    }),
  },
  highlighted: {
    backgroundColor: theme.colors.primary + '40', // 40% opacity
    fontWeight: 'bold',
  },
});

// Export memoized component for better performance
export default React.memo(TextDisplay);
