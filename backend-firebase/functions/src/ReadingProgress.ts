/**
 * Interface for tracking reading metrics
 */
export interface ReadingProgress {
  /** Total words successfully read */
  wordsRead: number;
  /** Reading accuracy percentage (0-100) */
  accuracy: number;
  /** Time taken to complete in seconds */
  completionTime: number;
  /** Optional comprehension score */
  comprehensionScore?: number;
  /** Timestamp of reading session */
  timestamp?: FirebaseFirestore.Timestamp;
}
