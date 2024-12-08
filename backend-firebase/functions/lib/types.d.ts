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
