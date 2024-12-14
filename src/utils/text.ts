/**
 * Text Utility Functions
 *
 * Provides text manipulation, analysis, and formatting utilities with
 * proper error handling and accessibility considerations.
 *
 * @packageDocumentation
 */

import { Platform } from 'react-native';

import type { TextSize, ReadingLevel } from '../types';

import { logError } from './analytics';

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
 * Sanitizes text input for security
 */
export const sanitizeText = (text: string): string => {
  try {
    return text
      .replace(/[<>]/g, '') // Remove potential HTML/XML tags
      .trim();
  } catch (error) {
    logError('Text sanitization failed:', error);
    return '';
  }
};

/**
 * Calculates reading level using Flesch-Kincaid
 */
export const calculateReadingLevel = (text: string): ReadingLevel => {
  try {
    const words = text.split(/\s+/).filter((word) => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const syllables = words.reduce(
      (count, word) => count + countSyllables(word),
      0,
    );

    const wordsPerSentence = words.length / sentences.length;
    const syllablesPerWord = syllables / words.length;

    const readingLevel = Math.round(
      0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59,
    );

    return Math.min(Math.max(readingLevel, 1), 12) as ReadingLevel;
  } catch (error) {
    logError('Reading level calculation failed:', error);
    return 1;
  }
};

/**
 * Counts syllables in a word
 */
const countSyllables = (word: string): number => {
  try {
    const cleaned = word.toLowerCase().replace(/[^a-z]/g, '');
    return cleaned
      .replace(/[^aeiouy]+/g, ' ')
      .trim()
      .split(/\s+/).length;
  } catch (error) {
    logError('Syllable counting failed:', error);
    return 1;
  }
};

/**
 * Formats text for display based on user preferences
 */
export const formatDisplayText = (
  text: string,
  options: FormatOptions = {},
): string => {
  const {
    maxLength = 100,
    ellipsis = '...',
    preserveWords = true,
    separator = ' ',
  } = options;

  try {
    if (text.length <= maxLength) {
      return text;
    }

    if (preserveWords) {
      const truncated = text.substr(0, maxLength);
      const lastSpace = truncated.lastIndexOf(separator);
      return `${truncated.substr(0, lastSpace)}${ellipsis}`;
    }

    return `${text.substr(0, maxLength)}${ellipsis}`;
  } catch (error) {
    logError('Text formatting failed:', error);
    return text;
  }
};

/**
 * Gets platform-specific font scaling
 */
export const getFontScale = (size: TextSize): number => {
  const baseSize = Platform.select({
    ios: 16,
    android: 14,
    default: 16,
  });

  const scales: Record<TextSize, number> = {
    small: 0.875,
    medium: 1,
    large: 1.25,
  };

  return baseSize * scales[size];
};

/**
 * Chunks text into manageable reading segments
 */
export const getReadingSegments = (
  text: string,
  segmentSize: number = 200,
): string[] => {
  try {
    const words = text.split(/\s+/);
    const segments: string[] = [];

    for (let i = 0; i < words.length; i += segmentSize) {
      segments.push(words.slice(i, i + segmentSize).join(' '));
    }

    return segments;
  } catch (error) {
    logError('Text segmentation failed:', error);
    return [text];
  }
};

export default {
  sanitizeText,
  calculateReadingLevel,
  formatDisplayText,
  getFontScale,
  getReadingSegments,
};
