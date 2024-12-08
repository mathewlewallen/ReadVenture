export interface UserProgress {
  userId: string;
  storyId: string;
  wordCount: number;
  accuracy: number;
  completionTime: number;
  timestamp: FirebaseFirestore.Timestamp;
}

export interface UserSettings {
  soundEffects: boolean;
  notifications: boolean;
  readingLevel: number;
  theme: string;
}

/**
 * Interface representing analytics data for a child user
 * @interface
 *
 * @property {string} childId - Unique identifier for the child
 * @property {string} displayName - Child's display name in the app
 * @property {Object} progress - Child's reading progress metrics
 * @property {number} progress.totalWordsRead - Total number of words read by the child
 * @property {number} progress.storiesCompleted - Number of stories completed by the child
 * @property {number} progress.averageAccuracy - Average reading comprehension accuracy (0-100)
 * @property {FirebaseFirestore.Timestamp} progress.lastActivity - Timestamp of child's last reading activity
 */
export interface ChildAnalytics {
  childId: string;
  displayName: string;
  progress: {
    totalWordsRead: number;
    storiesCompleted: number;
    averageAccuracy: number;
    lastActivity: FirebaseFirestore.Timestamp;
  };
}
