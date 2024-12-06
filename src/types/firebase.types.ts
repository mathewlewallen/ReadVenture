// src/types/firebase.types.ts
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isParent?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData extends LoginCredentials {
  displayName: string;
  isParent: boolean;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  difficulty: number;
  ageRange: number[];
  createdAt: Date;
}

export interface ReadingProgress {
  userId: string;
  storyId: string;
  wordsRead: number;
  accuracy: number;
  completedAt?: Date;
}
