/*
Generate a complete implementation for this file that:
1. Follows the project's React Native / TypeScript patterns
2. Uses proper imports and type definitions
3. Implements error handling and loading states
4. Includes JSDoc documentation
5. Follows project ESLint/Prettier rules
6. Integrates with existing app architecture
7. Includes proper testing considerations
8. Uses project's defined components and utilities
9. Handles proper memory management/cleanup
10. Follows accessibility guidelines

File requirements:
- Must integrate with Redux store
- Must use React hooks appropriately
- Must handle mobile-specific considerations
- Must maintain type safety
- Must have proper error boundaries
- Must follow project folder structure
- Must use existing shared components
- Must handle navigation properly
- Must scale well as app grows
- Must follow security best practices
*/
// src/services/ml/types.ts
/**
 * Metrics calculated from text analysis
 */
export interface TextMetrics {
  avgSentenceLength: number; // Average words per sentence
  avgWordLength: number; // Average characters per word
  uniqueWords: number; // Count of distinct words
  totalWords: number; // Total word count
  totalSentences: number; // Total sentence count
  syllablesPerWord: number; // Average syllables per word
  readabilityScore?: number; // Optional Flesch-Kincaid score
}

/**
 * Complexity scores for different aspects of the text
 */
export interface TextComplexity {
  vocabulary: number; // 0-1 score based on unique words ratio
  sentenceStructure: number; // 0-1 score based on sentence complexity
  textLength: number; // Raw word count
}

/**
 * Complete analysis result for a text passage
 */
export interface AnalysisResult {
  readingLevel: number; // Grade level (1-12)
  complexity: TextComplexity;
  metrics: TextMetrics;
  confidence: number; // 0-1 score of analysis confidence
}

/**
 * Areas assessed in comprehension
 */
export interface ComprehensionAreas {
  mainIdea: number; // 0-1 understanding of main concept
  details: number; // 0-1 recall of specific details
  vocabulary: number; // 0-1 understanding of key terms
  inference: number; // 0-1 ability to draw conclusions
}

/**
 * Complete comprehension assessment result
 */
export interface ComprehensionResult {
  score: number; // Overall score (0-100)
  areas: ComprehensionAreas;
  feedback: string[]; // Specific improvement suggestions
  recommendedLevel?: number; // Suggested next reading level
}

/**
 * Analysis configuration options
 */
export interface AnalysisOptions {
  minWords?: number; // Minimum words required
  maxGradeLevel?: number; // Maximum grade level to assess
  includeSyllables?: boolean; // Whether to count syllables
  locale?: string; // Language/region settings
}

/**
 * Validation result for text input
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
