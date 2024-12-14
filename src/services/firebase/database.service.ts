/**
 * Firebase Database Service with offline support
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  limit,
  QueryConstraint,
  getDoc,
} from 'firebase/firestore';

import { Story, ReadingProgress, User } from '../../types/firebase.types';
import { logError } from '../../utils/analytics';

import { db } from './config';

/** Collection names as constants */
enum Collections {
  STORIES = 'stories',
  READING_PROGRESS = 'readingProgress',
  USERS = 'users',
}

/** Query parameter interfaces */
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

/**
 * Database service using singleton pattern
 */
class DatabaseService {
  private static instance: DatabaseService;
  private readonly CACHE_PREFIX = '@db_cache_';
  private readonly CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

  private constructor() {
    // Initialize offline queue processing
    if (!__DEV__) {
      // Process queue on startup in production
      this.processQueue().catch((err) =>
        logError('Queue processing failed on startup', err),
      );
    }
  }

  /**
   * Gets singleton instance
   */
  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Gets stories with cache support
   */
  async getStories(filters?: StoryFilters): Promise<Story[]> {
    try {
      // Try cache first
      const cached = await this.getFromCache(
        `stories_${JSON.stringify(filters)}`,
      );
      if (cached) {
        return cached;
      }

      const stories = await this.fetchStories(filters);
      await this.saveToCache(`stories_${JSON.stringify(filters)}`, stories);
      return stories;
    } catch (error) {
      logError('Error fetching stories:', error);
      // Return cached data on error if available
      return this.getFromCache(`stories_${JSON.stringify(filters)}`) || [];
    }
  }

  /**
   * Fetches stories with optional filters
   */
  private async fetchStories(filters?: StoryFilters): Promise<Story[]> {
    try {
      const constraints: QueryConstraint[] = [];

      if (filters?.difficulty) {
        constraints.push(where('difficulty', '<=', filters.difficulty));
      }

      if (filters?.ageRange) {
        constraints.push(
          where('ageRange.min', '>=', filters.ageRange[0]),
          where('ageRange.max', '<=', filters.ageRange[1]),
        );
      }

      if (filters?.limit) {
        constraints.push(limit(filters.limit));
      }

      constraints.push(orderBy('difficulty', 'asc'));

      const storiesRef = collection(db, Collections.STORIES);
      const q = query(storiesRef, ...constraints);
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Story,
      );
    } catch (error) {
      logError('Error fetching stories:', error);
      throw error;
    }
  }

  /**
   * Updates reading progress
   */
  async updateProgress(
    userId: string,
    progress: Partial<ReadingProgress>,
  ): Promise<void> {
    try {
      const progressRef = doc(db, Collections.READING_PROGRESS, userId);
      await updateDoc(progressRef, {
        ...progress,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      logError('Error updating progress:', error);
      throw error;
    }
  }

  /**
   * Fetches user reading progress
   */
  async getProgress(filters: ProgressFilters): Promise<ReadingProgress[]> {
    try {
      const constraints: QueryConstraint[] = [
        where('userId', '==', filters.userId),
      ];

      if (filters.storyId) {
        constraints.push(where('storyId', '==', filters.storyId));
      }

      if (filters.limit) {
        constraints.push(limit(filters.limit));
      }

      constraints.push(orderBy('updatedAt', 'desc'));

      const progressRef = collection(db, Collections.READING_PROGRESS);
      const q = query(progressRef, ...constraints);
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as ReadingProgress,
      );
    } catch (error) {
      logError('Error fetching progress:', error);
      throw error;
    }
  }

  /**
   * Gets user with cache support
   */
  async getUser(userId: string): Promise<User | null> {
    try {
      // Try cache first
      const cached = await this.getFromCache(`user_${userId}`);
      if (cached) {
        return cached;
      }

      const userRef = doc(db, Collections.USERS, userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return null;
      }

      const userData = {
        id: userDoc.id,
        ...userDoc.data(),
      } as User;

      await this.saveToCache(`user_${userId}`, userData);
      return userData;
    } catch (error) {
      logError('Error fetching user:', error);
      // Return cached data on error if available
      return this.getFromCache(`user_${userId}`);
    }
  }

  /**
   * Updates user with offline queueing
   */
  async updateUser(userId: string, userData: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, Collections.USERS, userId);
      const updateData = {
        ...userData,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(userRef, updateData);
      await this.saveToCache(`user_${userId}`, updateData);
      await this.removeFromQueue(`update_user_${userId}`);
    } catch (error) {
      logError('Error updating user:', error);
      // Queue update for later if offline
      await this.addToQueue(`update_user_${userId}`, {
        type: 'UPDATE_USER',
        data: { userId, userData },
      });
      throw error;
    }
  }

  /**
   * Deletes user data
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      const userRef = doc(db, Collections.USERS, userId);
      await deleteDoc(userRef);
    } catch (error) {
      logError('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Saves data to cache
   */
  private async saveToCache<T>(key: string, data: T): Promise<void> {
    try {
      await AsyncStorage.setItem(
        `${this.CACHE_PREFIX}${key}`,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        }),
      );
    } catch (error) {
      logError('Cache save failed:', error);
    }
  }

  /**
   * Gets data from cache
   */
  private async getFromCache<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(`${this.CACHE_PREFIX}${key}`);
      if (!cached) {
        return null;
      }

      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > this.CACHE_EXPIRY) {
        await AsyncStorage.removeItem(`${this.CACHE_PREFIX}${key}`);
        return null;
      }

      return data;
    } catch (error) {
      logError('Cache retrieval failed:', error);
      return null;
    }
  }

  /**
   * Adds operation to offline queue
   */
  private async addToQueue(key: string, operation: any): Promise<void> {
    try {
      await AsyncStorage.setItem(
        `${this.CACHE_PREFIX}queue_${key}`,
        JSON.stringify(operation),
      );
    } catch (error) {
      logError('Queue add failed:', error);
    }
  }

  /**
   * Removes operation from offline queue
   */
  private async removeFromQueue(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${this.CACHE_PREFIX}queue_${key}`);
    } catch (error) {
      logError('Queue remove failed:', error);
    }
  }

  /**
   * Processes offline queue
   */
  public async processQueue(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const queueKeys = keys.filter((key) =>
        key.startsWith(`${this.CACHE_PREFIX}queue_`),
      );

      for (const key of queueKeys) {
        const operation = JSON.parse((await AsyncStorage.getItem(key)) || '{}');

        switch (operation.type) {
          case 'UPDATE_USER':
            await this.updateUser(
              operation.data.userId,
              operation.data.userData,
            );
            break;
          // Add other operation types as needed
        }
      }
    } catch (error) {
      logError('Queue processing failed:', error);
    }
  }
}

export const databaseService = DatabaseService.getInstance();

// Get cached data with fallback to network
const stories = await databaseService.getStories(filters);

// Updates work offline and sync when online
await databaseService.updateUser(userId, userData);

// Process pending offline operations
await databaseService.processQueue();
