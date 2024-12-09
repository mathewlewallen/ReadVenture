/**
 * ProgressBar Component
 *
 * A reusable progress indicator component that shows completion status.
 * Supports accessibility, custom colors, and responsive design.
 *
 * @packageDocumentation
 */

import React, { useMemo } from 'react';
import { StyleSheet, View, AccessibilityValue } from 'react-native';
import { ProgressBar as PaperProgressBar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { theme } from '../../theme';
import type { RootState } from '../../types';

interface ProgressBarProps {
  /** Current progress value */
  progress: number;
  /** Total value for calculating percentage */
  total: number;
  /** Custom color for progress bar */
  color?: string;
  /** Optional test ID for testing */
  testID?: string;
}

/**
 * Progress bar component showing completion status
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  total,
  color = theme.colors.primary,
  testID = 'progress-bar',
}) => {
  // Get theme from Redux store
  const isDarkMode = useSelector(
    (state: RootState) => state.settings.theme === 'dark',
  );

  // Calculate progress percentage
  const progressValue = useMemo(() => {
    // Ensure progress doesn't exceed total
    const safeProgress = Math.min(progress, total);
    // Prevent division by zero
    return total > 0 ? safeProgress / total : 0;
  }, [progress, total]);

  // Calculate percentage for accessibility
  const percentage = Math.round(progressValue * 100);

  // Define accessibility props
  const accessibilityProps = {
    accessibilityRole: 'progressbar' as const,
    accessibilityValue: {
      min: 0,
      max: 100,
      now: percentage,
    } as AccessibilityValue,
    accessibilityLabel: `Progress: ${percentage}%`,
  };

  return (
    <ErrorBoundary>
      <View
        style={[styles.container, isDarkMode && styles.containerDark]}
        testID={testID}
        {...accessibilityProps}
      >
        <PaperProgressBar
          progress={progressValue}
          color={color}
          style={[styles.progressBar, isDarkMode && styles.progressBarDark]}
        />
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 8,
    backgroundColor: theme.colors.background,
  },
  containerDark: {
    backgroundColor: '#1E1E1E',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  progressBarDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

// Add display name for debugging
ProgressBar.displayName = 'ProgressBar';

export default React.memo(ProgressBar);
