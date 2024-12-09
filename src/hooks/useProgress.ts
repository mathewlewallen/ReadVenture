/**
 * Custom hook for managing reading progress
 *
 * Handles fetching, updating, and caching of user reading progress.
 * Integrates with Redux store and Firebase backend.
 *
 * @packageDocumentation
 */

import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase/config';
import { updateProgress } from '../store/progressSlice';
import type { RootState, UserProgress, ReadingSession } from '../types';

interface UseProgressOptions {
  userId?: string;
  cacheTime?: number;
}

interface UseProgressResult {
  progress: UserProgress | null;
  loading: boolean;
  error: Error | null;
  updateUserProgress: (sessionData: ReadingSession) => Promise<void>;
  resetProgress: () => Promise<void>;
}

const PROGRESS_CACHE_KEY = '@progress_cache';
const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

/**
 * Hook for managing user reading progress
 *
 * @param options - Configuration options for progress management
 * @returns Progress data, loading state, error state, and update functions
 */
export const useProgress = ({
  userId,
  cacheTime = DEFAULT_CACHE_TIME,
}: UseProgressOptions = {}): UseProgressResult => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetches progress from Firestore
   */
  const fetchProgress = useCallback(async () => {
    try {
      const targetUserId = userId || currentUser?.id;
      if (!targetUserId) throw new Error('No user ID available');

      const progressRef = collection(db, 'progress');
      const q = query(progressRef, where('userId', '==', targetUserId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return null;
      }

      const progressData = snapshot.docs[0].data() as UserProgress;
      await AsyncStorage.setItem(PROGRESS_CACHE_KEY, JSON.stringify({
        data: progressData,
        timestamp: Date.now(),
      }));

      dispatch(updateProgress(progressData));
      return progressData;
    } catch (err) {
      console.error('Error fetching progress:', err);
      throw err;
    }
  }, [userId, currentUser?.id, dispatch]);

  /**
   * Updates user progress with new session data
   */
  const updateUserProgress = async (sessionData: ReadingSession): Promise<void> => {
    try {
      setLoading(true);
      const targetUserId = userId || currentUser?.id;
      if (!targetUserId) throw new Error('No user ID available');

      // Calculate new progress totals
      const existingProgress = await fetchProgress();
      const newProgress: UserProgress = {
        totalWordsRead: (existingProgress?.totalWordsRead || 0) + sessionData.wordsRead,
        storiesCompleted: (existingProgress?.storiesCompleted || 0) + 1,
        averageAccuracy: calculateNewAverage(
          existingProgress?.averageAccuracy || 0,
          sessionData.accuracy,
          existingProgress?.storiesCompleted || 0
        ),
        badges: existingProgress?.badges || [],
        lastActivity: sessionData.timestamp,
      };

      // Update Firestore and local cache
      await updateProgressInFirestore(targetUserId, newProgress);
      dispatch(updateProgress(newProgress));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update progress');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resets user progress
   */
  const resetProgress = async (): Promise<void> => {
    try {
      setLoading(true);
      const targetUserId = userId || currentUser?.id;
      if (!targetUserId) throw new Error('No user ID available');

      await updateProgressInFirestore(targetUserId, null);
      await AsyncStorage.removeItem(PROGRESS_CACHE_KEY);
      dispatch(updateProgress(null));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to reset progress');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load initial progress
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const cached = await AsyncStorage.getItem(PROGRESS_CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < cacheTime) {
            dispatch(updateProgress(data));
            setLoading(false);
            return;
          }
        }
        await fetchProgress();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load progress');
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();

    return () => {
      // Cleanup if needed
    };
  }, [dispatch, fetchProgress, cacheTime]);

  return {
    progress: useSelector((state: RootState) => state.progress.data),
    loading,
    error,
    updateUserProgress,
    resetProgress,
  };
};

/**
 * Calculates new average accuracy
 */
const calculateNewAverage = (
  oldAverage: number,
  newValue: number,
  oldCount: number
): number => {
  return ((oldAverage * oldCount) + newValue) / (oldCount + 1);
};

/**
 * Updates progress in Firestore
 */
const updateProgressInFirestore = async (
  userId: string,
  progress: UserProgress | null
): Promise<void> => {
  const progressRef = collection(db, 'progress');
  const q = query(progressRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    await snapshot.docs[0].ref.update(progress || { deleted: true });
  } else if (progress) {
    await progressRef.add({ ...progress, userId });
  }
};

export default useProgress;
