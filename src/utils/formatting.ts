/**
 * Text Formatting Utilities
 *
 * Provides formatting functions for text display, reading metrics,
 * and accessibility support. Integrates with app theme and localization.
 *
 * @packageDocumentation
 */

import { Platform } from 'react-native';
import { store } from '../store';
import { theme } from '../theme';
import { logError } from './analytics';
import type { TextSize, ReadingProgress } from '../types';

/**
 * Text formatting options
 */
interface FormatOptions {
  /** Maximum length before truncation */
  maxLength?: number;
  /** Text to append when truncated */
  ellipsis?: string;
  /** Whether to preserve word boundaries */
  preserveWords?: boolean;
  /** Custom separator for joining */
  separator?: string;
}

/**
 * Formats reading time in minutes and seconds
 */
export const formatReadingTime = (seconds: number): string => {
  try {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return minutes > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${remainingSeconds}s`;
  } catch (error) {
    logError('Reading time format failed:', error);
    return '0s';
  }
};

/**
 * Formats progress percentage with proper rounding
 */
export const formatProgress = (
  current: number,
  total: number,
  decimalPlaces = 1,
): string => {
  try {
    if (total <= 0) return '0%';
    const percentage = (current / total) * 100;
    return `${percentage.toFixed(decimalPlaces)}%`;
  } catch (error) {
    logError('Progress format failed:', error);
    return '0%';
  }
};

/**
 * Truncates text with configurable options
 */
export const truncateText = (
  text: string,
  options: FormatOptions = {},
): string => {
  const { maxLength = 100, ellipsis = '...', preserveWords = true } = options;

  try {
    if (text.length <= maxLength) return text;

    if (preserveWords) {
      const truncated = text.substr(0, maxLength);
      const lastSpace = truncated.lastIndexOf(' ');
      return `${truncated.substr(0, lastSpace)}${ellipsis}`;
    }

    return `${text.substr(0, maxLength)}${ellipsis}`;
  } catch (error) {
    logError('Text truncation failed:', error);
    return text;
  }
};

/**
 * Formats reading metrics for display
 */
export const formatReadingMetrics = (
  progress: ReadingProgress,
): { accuracy: string; speed: string; time: string } => {
  try {
    return {
      accuracy: `${Math.round(progress.accuracy)}%`,
      speed: `${Math.round(progress.wordsRead / (progress.duration / 60))} wpm`,
      time: formatReadingTime(progress.duration),
    };
  } catch (error) {
    logError('Metrics formatting failed:', error);
    return {
      accuracy: '0%',
      speed: '0 wpm',
      time: '0s',
    };
  }
};

/**
 * Gets font size based on user preference
 */
export const getFontSize = (size: TextSize): number => {
  const baseFontSize = Platform.select({
    ios: 16,
    android: 14,
    default: 16,
  });

  const sizeMappings: Record<TextSize, number> = {
    small: baseFontSize * 0.875,
    medium: baseFontSize,
    large: baseFontSize * 1.25,
  };

  return sizeMappings[size] || baseFontSize;
};

/**
 * Formats number with proper separators
 */
export const formatNumber = (
  num: number,
  options: Intl.NumberFormatOptions = {},
): string => {
  try {
    return new Intl.NumberFormat(undefined, options).format(num);
  } catch (error) {
    logError('Number formatting failed:', error);
    return num.toString();
  }
};

export default {
  formatReadingTime,
  formatProgress,
  truncateText,
  formatReadingMetrics,
  getFontSize,
  formatNumber,
};
