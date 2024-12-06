// src/services/firebase/database.service.ts
import { db } from './config';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  limit,
  QueryConstraint,
  DocumentData,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { Story, ReadingProgress, User } from '../../types/firebase.types';

// Collection names as constants
enum Collections {
  STORIES = 'stories',
  READING_PROGRESS = 'readingProgress',
  USERS = 'users',
}

// Query parameter interfaces
interface StoryFilters {
  difficulty?: number;
  ageRange?: [number, number];
  limit?: number;
}

interface ProgressFilters {
  userId: string;
  storyId?: string;
  limit?: number;
}

class DatabaseService {
  private static instance: DatabaseService;

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Query builder helpers
  private buildStoryQuery(filters?: StoryFilters): QueryConstraint[] {
    const constraints: QueryConstraint[] = [];

    if (filters?.difficulty !== undefined) {
      constraints.push(where('difficulty', '<=', filters.difficulty));
    }

    if (filters?.ageRange) {
      const [minAge, maxAge] = filters.ageRange;
      constraints.push(where('minAge', '>=', minAge), where('maxAge', '<=', maxAge));
    }

    constraints.push(orderBy('difficulty', 'asc'));

    if (filters?.limit) {
      constraints.push(limit(filters.limit));
    }

    return constraints;
  }

  // Stories methods
  async getStories(filters?: StoryFilters): Promise<Story[]> {
    try {
      const constraints = this.buildStoryQuery(filters);
      const q = query(collection(db, Collections.STORIES), ...constraints);
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Story[];
    } catch (error) {
      console.error('Error fetching stories:', error);
      throw error;
    }
  }

  async getStoryById(storyId: string): Promise<Story | null> {
    try {
      const storyDoc = await getDoc(doc(db, Collections.STORIES, storyId));
      if (!storyDoc.exists()) return null;
      return { id: storyDoc.id, ...storyDoc.data() } as Story;
    } catch (error) {
      console.error('Error fetching story:', error);
      throw error;
    }
  }

  async addStory(story: Omit<Story, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, Collections.STORIES), {
        ...story,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding story:', error);
      throw error;
    }
  }

  async updateStory(storyId: string, story: Partial<Story>): Promise<void> {
    try {
      const storyRef = doc(db, Collections.STORIES, storyId);
      await updateDoc(storyRef, {
        ...story,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating story:', error);
      throw error;
    }
  }

  async deleteStory(storyId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, Collections.STORIES, storyId));
    } catch (error) {
      console.error('Error deleting story:', error);
      throw error;
    }
  }

  // Reading Progress methods
  async saveReadingProgress(progress: Omit<ReadingProgress, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, Collections.READING_PROGRESS), {
        ...progress,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving reading progress:', error);
      throw error;
    }
  }

  async updateReadingProgress(
    progressId: string,
    updates: Partial<ReadingProgress>
  ): Promise<void> {
    try {
      const progressRef = doc(db, Collections.READING_PROGRESS, progressId);
      await updateDoc(progressRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating reading progress:', error);
      throw error;
    }
  }

  async getUserProgress(filters: ProgressFilters): Promise<ReadingProgress[]> {
    try {
      const constraints: QueryConstraint[] = [
        where('userId', '==', filters.userId),
        orderBy('updatedAt', 'desc'),
      ];

      if (filters.storyId) {
        constraints.push(where('storyId', '==', filters.storyId));
      }

      if (filters.limit) {
        constraints.push(limit(filters.limit));
      }

      const q = query(collection(db, Collections.READING_PROGRESS), ...constraints);
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ReadingProgress[];
    } catch (error) {
      console.error('Error fetching reading progress:', error);
      throw error;
    }
  }

  // User methods
  async createUser(userId: string, userData: Omit<User, 'id'>): Promise<void> {
    try {
      await setDoc(doc(db, Collections.USERS, userId), {
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, Collections.USERS, userId));
      if (!userDoc.exists()) return null;
      return { id: userDoc.id, ...userDoc.data() } as User;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  async updateUserProfile(userId: string, data: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, Collections.USERS, userId);
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
}

export default DatabaseService.getInstance();
