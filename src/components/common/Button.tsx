/**
 * Custom Button Component
 *
 * A reusable button component that follows accessibility guidelines,
 * supports loading states, and provides consistent styling across the app.
 *
 * @packageDocumentation
 */

import React, { useCallback, memo } from 'react';
import {
  StyleSheet,
  Platform,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { theme } from '../../theme';
import { ErrorBoundary } from '../common/ErrorBoundary';
import type { RootState } from '../../types';

interface ButtonProps {
  /** Button label text */
  label: string;
  /** Called when button is pressed */
  onPress: () => void;
  /** Optional icon name from MaterialIcons */
  icon?: string;
  /** Button mode - contained, outlined, or text */
  mode?: 'contained' | 'outlined' | 'text';
  /** Whether button is in loading state */
  loading?: boolean;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Custom styles to apply to button */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Accessibility hint for screen readers */
  accessibilityHint?: string;
  /** Test ID for testing */
  testID?: string;
}

/**
 * Custom button component with loading state and accessibility
 */
const Button: React.FC<ButtonProps> = memo(
  ({
    label,
    onPress,
    icon,
    mode = 'contained',
    loading = false,
    disabled = false,
    style,
    accessibilityLabel,
    accessibilityHint,
    testID,
  }) => {
    const theme = useSelector((state: RootState) => state.settings.theme);

    /**
     * Handles button press with loading state
     */
    const handlePress = useCallback(() => {
      if (!loading && !disabled) {
        onPress();
      }
    }, [loading, disabled, onPress]);

    return (
      <ErrorBoundary>
        <PaperButton
          mode={mode}
          onPress={handlePress}
          icon={icon}
          loading={loading}
          disabled={disabled || loading}
          style={[styles.button, style]}
          labelStyle={styles.label}
          contentStyle={styles.content}
          accessibilityLabel={accessibilityLabel || label}
          accessibilityHint={accessibilityHint}
          accessibilityState={{
            disabled: disabled || loading,
            busy: loading,
          }}
          testID={testID}
        >
          {loading ? (
            <ActivityIndicator
              color={theme === 'dark' ? '#FFFFFF' : '#000000'}
              size="small"
            />
          ) : (
            label
          )}
        </PaperButton>
      </ErrorBoundary>
    );
  },
);

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    marginVertical: 8,
    minWidth: 120,
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
  label: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    textAlign: 'center',
  },
  content: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Add display name for debugging
Button.displayName = 'Button';

export default Button;
