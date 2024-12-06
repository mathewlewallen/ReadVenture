export interface User {
  id: string;
  email: string;
  displayName?: string;
  role: 'student' | 'parent';
  parentEmail?: string;
  settings: UserSettings;
  progress: UserProgress;
}

export interface UserSettings {
  readingLevel: number;
  soundEffectsEnabled: boolean;
  textSize: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark';
}

export interface UserProgress {
  totalWordsRead: number;
  storiesCompleted: number;
  averageAccuracy: number;
  badges: string[];
}
