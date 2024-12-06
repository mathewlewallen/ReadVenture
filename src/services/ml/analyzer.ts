// src/services/ml/analyzer.ts
import { AnalysisResult, ComprehensionResult, TextMetrics } from './types';
import { countSyllables, calculateFleschKincaid } from './utils';

export class TextAnalyzer {
  private static readonly MIN_TEXT_LENGTH = 10;
  private static readonly MAX_GRADE_LEVEL = 12;

  static analyzeReadingLevel(text: string): AnalysisResult {
    if (!text || text.trim().length < this.MIN_TEXT_LENGTH) {
      throw new Error('Text is too short for analysis');
    }

    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const words = text.split(/\s+/).filter((word) => word.length > 0);
    const syllables = words.reduce((total, word) => total + countSyllables(word), 0);

    const metrics: TextMetrics = {
      avgSentenceLength: words.length / sentences.length,
      avgWordLength: words.join('').length / words.length,
      uniqueWords: new Set(words.map((w) => w.toLowerCase())).size,
      totalWords: words.length,
      totalSentences: sentences.length,
      syllablesPerWord: syllables / words.length,
    };

    const readingLevel = Math.min(
      Math.round(calculateFleschKincaid(metrics)),
      this.MAX_GRADE_LEVEL
    );

    return {
      readingLevel,
      complexity: {
        vocabulary: metrics.uniqueWords / metrics.totalWords,
        sentenceStructure: Math.min(metrics.avgSentenceLength / 20, 1),
        textLength: metrics.totalWords,
      },
      metrics,
    };
  }

  static analyzeComprehension(
    answers: Record<string, string>,
    correctAnswers: Record<string, string>
  ): ComprehensionResult {
    const areas = {
      mainIdea: 0,
      details: 0,
      vocabulary: 0,
      inference: 0,
    };

    const feedback: string[] = [];
    let totalScore = 0;
    let questionsAnswered = 0;

    for (const [questionId, answer] of Object.entries(answers)) {
      const correctAnswer = correctAnswers[questionId];
      if (!correctAnswer) continue;

      const similarity = this.calculateAnswerSimilarity(answer, correctAnswer);
      questionsAnswered++;

      this.updateAreaScores(questionId, similarity, areas);
      this.updateFeedback(similarity, questionId, feedback);

      totalScore += similarity;
    }

    return {
      score: questionsAnswered ? (totalScore / questionsAnswered) * 100 : 0,
      areas,
      feedback,
    };
  }

  private static updateAreaScores(
    questionId: string,
    similarity: number,
    areas: Record<string, number>
  ): void {
    const questionType = questionId.split('_')[0];
    switch (questionType) {
      case 'main':
        areas.mainIdea = similarity;
        break;
      case 'detail':
        areas.details = similarity;
        break;
      case 'vocab':
        areas.vocabulary = similarity;
        break;
      case 'infer':
        areas.inference = similarity;
        break;
    }
  }

  private static updateFeedback(similarity: number, questionId: string, feedback: string[]): void {
    if (similarity < 0.7) {
      feedback.push(`Review your answer for question ${questionId}`);
    }
  }

  private static calculateAnswerSimilarity(answer: string, correctAnswer: string): number {
    // Simple word overlap similarity - could be enhanced with more sophisticated NLP
    const answerWords = new Set(answer.toLowerCase().split(/\s+/));
    const correctWords = new Set(correctAnswer.toLowerCase().split(/\s+/));

    const intersection = new Set([...answerWords].filter((word) => correctWords.has(word)));

    return intersection.size / Math.max(answerWords.size, correctWords.size);
  }
}
