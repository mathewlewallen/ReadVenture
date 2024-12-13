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

import {
  AnalysisResult,
  ComprehensionResult,
  TextMetrics,
} from './types';

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
      if (!text?.trim()) throw new Error('Invalid text input');

      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const words = text.split(/\s+/).filter(w => w.trim().length > 0);

      const metrics = {
        totalWords: words.length,
        totalSentences: sentences.length,
        avgWordLength: words.join('').length / words.length,
        uniqueWords: new Set(words.map(w => w.toLowerCase())).size,
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
        if (isCorrect) correctCount++;
      });

      const score =
        totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

      return {
        score,
        correctCount,
        totalQuestions,
        details,
        timestamp: new Date().toISOString(),
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
}

export default TextAnalyzer;
