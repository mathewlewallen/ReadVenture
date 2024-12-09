/**
 * Machine Learning Service Types
 *
 * Type definitions for text analysis, comprehension assessment,
 * and reading level evaluation features.
 *
 * @packageDocumentation
 */

import { FirebaseFirestore } from '@firebase/firestore-types';

/**
 * Metrics calculated from text analysis
 */
export interface TextMetrics {
  /** Average words per sentence */
  avgSentenceLength: number;
  /** Average characters per word */
  avgWordLength: number;
  /** Count of distinct words */
  uniqueWords: number;
  /** Total word count */
  totalWords: number;
  /** Total sentence count */
  totalSentences: number;
  /** Average syllables per word */
  syllablesPerWord: number;
  /** Optional Flesch-Kincaid score */
  readabilityScore?: number;
  /** Timestamp of analysis */
  timestamp?: FirebaseFirestore.Timestamp;
}

/**
 * Complexity scores for different aspects of the text
 */
export interface TextComplexity {
  /** 0-1 score based on unique words ratio */
  vocabulary: number;
  /** 0-1 score based on sentence complexity */
  sentenceStructure: number;
  /** Raw word count */
  textLength: number;
}

/**
 * Complete analysis result for a text passage
 */
export interface AnalysisResult {
  /** Grade level (1-12) */
  readingLevel: number;
  /** Complexity metrics */
  complexity: TextComplexity;
  /** Detailed text metrics */
  metrics: TextMetrics;
  /** 0-1 score of analysis confidence */
  confidence: number;
  /** Analysis timestamp */
  timestamp: string;
}

/**
 * Areas assessed in comprehension
 */
export interface ComprehensionAreas {
  /** 0-1 understanding of main concept */
  mainIdea: number;
  /** 0-1 recall of specific details */
  details: number;
  /** 0-1 understanding of key terms */
  vocabulary: number;
  /** 0-1 ability to draw conclusions */
  inference: number;
}

/**
 * Complete comprehension assessment result
 */
export interface ComprehensionResult {
  /** Overall score (0-100) */
  score: number;
  /** Number of correct answers */
  correctCount: number;
  /** Total number of questions */
  totalQuestions: number;
  /** Detailed assessment by area */
  areas: ComprehensionAreas;
  /** Question-specific results */
  details: Record<string, boolean>;
  /** Assessment timestamp */
  timestamp: string;
}

/**
 * Reading progress tracking
 */
export interface ReadingProgress {
  /** Story identifier */
  storyId: string;
  /** Words successfully read */
  wordsRead: number;
  /** Reading accuracy (0-100) */
  accuracy: number;
  /** Time spent reading (seconds) */
  timeSpent: number;
  /** Comprehension score if available */
  comprehension?: ComprehensionResult;
  /** Last reading timestamp */
  lastRead: FirebaseFirestore.Timestamp;
}

/**
 * Analysis service configuration
 */
export interface AnalysisConfig {
  /** Minimum text length for analysis */
  minTextLength: number;
  /** Maximum grade level */
  maxGradeLevel: number;
  /** Confidence threshold */
  minConfidence: number;
  /** Cache duration in milliseconds */
  cacheDuration: number;
}

/**
 * Error types for analysis service
 */
export enum AnalysisErrorType {
  VALIDATION = 'validation_error',
  PROCESSING = 'processing_error',
  TIMEOUT = 'timeout_error',
  SERVICE = 'service_error',
}

/**
 * Analysis service error
 */
export interface AnalysisError extends Error {
  /** Error type */
  type: AnalysisErrorType;
  /** Additional error context */
  context?: Record<string, unknown>;
}

export type AnalysisCallback = (result: AnalysisResult) => void;
export type ErrorCallback = (error: AnalysisError) => void;
