/**
 * Text Analysis Service
 *
 * Provides text analysis functionality including:
 * - Reading level assessment
 * - Comprehension analysis
 * - Text complexity metrics
 *
 * @packageDocumentation
 */

import { logError } from '../../utils/analytics';

import type { AnalysisResult, ComprehensionResult, TextMetrics, TextComplexity } from './types';

/**
 * Text analysis service class
 */
export class TextAnalyzer {
  private static readonly MIN_TEXT_LENGTH = 10;
  private static readonly MAX_GRADE_LEVEL = 12;
  private static readonly COMPLEXITY_THRESHOLDS = {
    EASY: 0.3,
    MEDIUM: 0.6,
    HARD: 0.9,
  };

  /**
   * Analyzes text reading level and complexity
   * @throws {Error} If text is too short or invalid
   */
  static analyzeReadingLevel(text: string): AnalysisResult {
    try {
      if (!text?.trim()) {
        throw new Error('Invalid text input');
      }

      const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
      const words = text.split(/\s+/).filter((w) => w.trim().length > 0);

      const metrics = {
        totalWords: words.length,
        totalSentences: sentences.length,
        avgWordLength: words.join('').length / words.length,
        avgSentenceLength: words.length / sentences.length,
        uniqueWords: new Set(words.map((w) => w.toLowerCase())).size,
        syllablesPerWord: this.calculateSyllables(words),
      };

      return {
        readingLevel: this.calculateGradeLevel(metrics),
        complexity: this.calculateComplexity(metrics),
        metrics,
        confidence: this.calculateConfidence(metrics),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logError('Text analysis failed:', error);
      throw error;
    }
  }

  /**
   * Analyzes reading comprehension based on answers
   */
  static analyzeComprehension(
    answers: Record<string, string>,
    correctAnswers: Record<string, string>,
  ): ComprehensionResult {
    try {
      const totalQuestions = Object.keys(correctAnswers).length;
      let correctCount = 0;
      const details: Record<string, boolean> = {};

      // Compare answers
      Object.entries(answers).forEach(([questionId, answer]) => {
        const isCorrect = answer === correctAnswers[questionId];
        details[questionId] = isCorrect;
        if (isCorrect) {
          correctCount++;
        }
      });

      const score =
        totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

      return {
        score,
        correctCount,
        totalQuestions,
        details,
        timestamp: new Date().toISOString(),
        areas: {
          mainIdea: 0,
          details: 0,
          vocabulary: 0,
          inference: 0
        },
      };
    } catch (error) {
      logError('Comprehension analysis failed:', error);
      throw error;
    }
  }

  /**
   * Calculates vocabulary complexity score
   */
  private static calculateVocabularyScore(metrics: TextMetrics): number {
    const uniqueRatio = metrics.uniqueWords / metrics.totalWords;
    return Math.min(uniqueRatio * 2, 1);
  }

  /**
   * Calculates sentence structure complexity score
   */
  private static calculateSentenceScore(metrics: TextMetrics): number {
    return Math.min(metrics.avgSentenceLength / 20, 1);
  }

  /**
   * Calculates text length complexity score
   */
  private static calculateLengthScore(totalWords: number): number {
    const normalized = Math.min(totalWords / 1000, 1);
    return normalized;
  }

  /**
   * Calculates overall text complexity score
   */
  private static calculateComplexity(metrics: TextMetrics): TextComplexity {
    const vocabScore = this.calculateVocabularyScore(metrics);
    const sentenceScore = this.calculateSentenceScore(metrics);
    const lengthScore = this.calculateLengthScore(metrics.totalWords);
    const score = (vocabScore + sentenceScore + lengthScore) / 3;

    if (score <= this.COMPLEXITY_THRESHOLDS.EASY) return 'EASY';
    if (score <= this.COMPLEXITY_THRESHOLDS.MEDIUM) return 'MEDIUM';
    return 'HARD';
  }

  /**
   * Calculates average syllables per word
   */
  private static calculateSyllables(words: string[]): number {
    const countSyllables = (word: string): number => {
      const matches = word.toLowerCase().match(/[aeiouy]+/g);
      return matches ? matches.length : 1;
    };

    const totalSyllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
    return totalSyllables / words.length;
  }

  /**
   * Calculates reading grade level based on text metrics
   */
  private static calculateGradeLevel(metrics: TextMetrics): number {
    const fleschKincaid = 0.39 * (metrics.totalWords / metrics.totalSentences) +
      11.8 * metrics.syllablesPerWord - 15.59;
    return Math.min(Math.max(Math.round(fleschKincaid), 1), this.MAX_GRADE_LEVEL);
  }

  /**
   * Calculates confidence score for the analysis
   */
  private static calculateConfidence(metrics: TextMetrics): number {
    return Math.min(metrics.totalWords / 100, 1);
  }
}

export default TextAnalyzer;
