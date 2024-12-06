export interface ReadingSettings {
  fontSize: number;
  readingSpeed: number;
  highlightColor: string;
  soundEffectsEnabled: boolean;
}

export interface ReadingProgress {
  storyId: string;
  currentPosition: number;
  wordsRead: number;
  accuracy: number;
  timestamp: number;
}

export interface ReadingStats {
  totalWordsRead: number;
  averageAccuracy: number;
  readingSpeed: number;
  storiesCompleted: number;
}
