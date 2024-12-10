/**
 * Progress Service
 *
 * Handles reading progress tracking, analytics, and persistence.
 * Integrates with Firebase and local storage for offline support.
 *
 * @packageDocumentation
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';

import { store } from '../../store';
import type { ReadingProgress, UserProgress, ApiResponse } from '../../types';
import { logError } from '../../utils/analytics';
import { db } from '../firebase/config';

/**
 * Progress tracking service class
 */
export class ProgressService {
  private static instance: ProgressService;
  private readonly STORAGE_KEY = '@progress';

  private constructor() {}

  /**
   * Gets singleton instance
   */
  public static getInstance(): ProgressService {
    if (!ProgressService.instance) {
      ProgressService.instance = new ProgressService();
    }
    return ProgressService.instance;
  }

  /**
   * Updates reading progress for current story
   */
  public async updateProgress(
    storyId: string,
    progress: Partial<ReadingProgress>,
  ): Promise<ApiResponse<ReadingProgress>> {
    try {
      const userId = store.getState().auth.user?.id;
      if (!userId) throw new Error('User not authenticated');

      // Update Firestore
      const progressRef = doc(db, 'progress', `${userId}_${storyId}`);
      await updateDoc(progressRef, {
        ...progress,
        updatedAt: new Date().toISOString(),
      });

      // Update local storage
      await this.updateLocalProgress(storyId, progress);

      return {
        success: true,
        data: await this.getProgress(storyId),
      };
    } catch (error) {
      logError('Progress update failed:', error);
      throw error;
    }
  }

  /**
   * Gets progress for a specific story
   */
  public async getProgress(storyId: string): Promise<ReadingProgress> {
    try {
      const userId = store.getState().auth.user?.id;
      if (!userId) throw new Error('User not authenticated');

      // Try local storage first
      const localProgress = await this.getLocalProgress(storyId);
      if (localProgress) return localProgress;

      // Fallback to Firestore
      const progressRef = doc(db, 'progress', `${userId}_${storyId}`);
      const progressDoc = await getDocs(
        query(
          collection(db, 'progress'),
          where('userId', '==', userId),
          where('storyId', '==', storyId),
        ),
      );

      if (progressDoc.empty) {
        return this.createInitialProgress(storyId);
      }

      const progress = progressDoc.docs[0].data() as ReadingProgress;
      await this.updateLocalProgress(storyId, progress);

      return progress;
    } catch (error) {
      logError('Progress fetch failed', error);
      throw error;
    }
  }

  /**
   * Gets overall user progress
   */
  public async getUserProgress(): Promise<UserProgress> {
    try {
      const userId = store.getState().auth.user?.id;
      if (!userId) throw new Error('User not authenticated');

      const progressDocs = await getDocs(
        query(collection(db, 'progress'), where('userId', '==', userId)),
      );

      const progress: UserProgress = {
        totalWordsRead: 0,
        storiesCompleted: 0,
        averageAccuracy: 0,
        lastActivity: new Date(),
      };

      progressDocs.forEach(doc => {
        const data = doc.data() as ReadingProgress;
        progress.totalWordsRead += data.wordsRead;
        if (data.completed) progress.storiesCompleted++;
        progress.averageAccuracy =
          (progress.averageAccuracy + data.accuracy) / 2;
      });

      return progress;
    } catch (error) {
      logError('User progress fetch failed', error);
      throw error;
    }
  }

  /**
   * Updates progress in local storage
   */
  private async updateLocalProgress(
    storyId: string,
    progress: Partial<ReadingProgress>,
  ): Promise<void> {
    try {
      const key = `${this.STORAGE_KEY}_${storyId}`;
      const existing = await AsyncStorage.getItem(key);
      const updated = {
        ...(existing ? JSON.parse(existing) : {}),
        ...progress,
      };
      await AsyncStorage.setItem(key, JSON.stringify(updated));
    } catch (error) {
      logError('Local progress update failed', error);
    }
  }

  /**
   * Gets progress from local storage
   */
  private async getLocalProgress(
    storyId: string,
  ): Promise<ReadingProgress | null> {
    try {
      const progress = await AsyncStorage.getItem(
        `${this.STORAGE_KEY}_${storyId}`,
      );
      return progress ? JSON.parse(progress) : null;
    } catch (error) {
      logError('Local progress fetch failed', error);
      return null;
    }
  }

  /**
   * Creates initial progress record
   */
  private createInitialProgress(storyId: string): ReadingProgress {
    return {
      storyId,
      userId: store.getState().auth.user?.id || '',
      wordsRead: 0,
      accuracy: 0,
      completed: false,
      lastRead: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

export const progressService = ProgressService.getInstance();
