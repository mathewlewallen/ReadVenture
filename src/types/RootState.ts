// types/RootState.ts

// Import individual slice state types
import { AuthState } from '../store/slices/authSlice';
import { ProgressState } from '../store/slices/progressSlice';
import { SettingsState } from '../store/slices/settingsSlice';
import { StoryState } from '../store/slices/storySlice';

export interface RootState {
  auth: AuthState;
  progress: ProgressState;
  settings: SettingsState;
  stories: StoryState;
}

// Define individual slice states
export interface AuthState {
  user: {
    id: string | null;
    email: string | null;
    role: 'student' | 'parent' | 'teacher' | null;
    displayName: string | null;
  };
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ProgressState {
  currentStory: string | null;
  readingStats: {
    wordsPerMinute: number;
    accuracy: number;
    comprehensionScore: number;
  };
  isLoading: boolean;
  error: string | null;
}

export interface SettingsState {
  theme: 'light' | 'dark';
  fontSize: number;
  readingSpeed: number;
  notifications: boolean;
  parentalControls: boolean;
}

export interface StoryState {
  stories: Array<{
    id: string;
    title: string;
    difficulty: number;
    completed: boolean;
  }>;
  selectedStory: string | null;
  loading: boolean;
  error: string | null;
}
