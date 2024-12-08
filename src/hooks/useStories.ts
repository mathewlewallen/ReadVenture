/**
 * Custom hook for managing stories data
 *
 * Handles fetching, filtering, and caching of story data from Firebase.
 * Integrates with Redux store and provides loading/error states.
 *
 * @packageDocumentation
 */

import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { databaseService } from '../services/firebase/database.service';
import { fetchStoriesStart, fetchStoriesSuccess, fetchStoriesFailure } from '../store/storySlice';
import type { Story, RootState } from '../types';

interface UseStoriesOptions {
  difficulty?: number;
  ageRange?: [number, number];
  limit?: number;
  cacheTime?: number;
}

interface UseStoriesResult {
  stories: Story[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and managing stories
 *
 * @param options - Configuration options for story fetching
 * @returns Story data, loading state, error state, and refetch function
 */
export const useStories = ({
  difficulty,
  ageRange,
  limit = 20,
  cacheTime = 5 * 60 * 1000, // 5 minutes
}: UseStoriesOptions = {}): UseStoriesResult => {
  const dispatch = useDispatch();
  const cachedStories = useSelector((state: RootState) => state.stories.items);
  const lastFetch = useSelector((state: RootState) => state.stories.lastFetch);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Validates input parameters
   */
  const validateParams = useCallback(() => {
    if (difficulty && (difficulty < 1 || difficulty > 10)) {
      throw new Error('Difficulty must be between 1 and 10');
    }
    if (ageRange && (
      ageRange.length !== 2 ||
      ageRange[0] > ageRange[1] ||
      ageRange[0] < 4 ||
      ageRange[1] > 12
    )) {
      throw new Error('Invalid age range');
    }
  }, [difficulty, ageRange]);

  /**
   * Fetches stories from the database
   */
  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      validateParams();

      dispatch(fetchStoriesStart());

      const filters = {
        ...(difficulty && { difficulty }),
        ...(ageRange && { ageRange }),
        limit,
      };

      const data = await databaseService.getStories(filters);
      dispatch(fetchStoriesSuccess({ stories: data, timestamp: Date.now() }));
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch stories');
      setError(error);
      dispatch(fetchStoriesFailure(error.message));
      throw error;
    } finally {
      setLoading(false);
    }
  }, [dispatch, difficulty, ageRange, limit, validateParams]);

  /**
   * Determines if cache is valid
   */
  const isCacheValid = useCallback(() => {
    if (!lastFetch) return false;
    return Date.now() - lastFetch < cacheTime;
  }, [lastFetch, cacheTime]);

  /**
   * Initial data fetch and cache management
   */
  useEffect(() => {
    const loadStories = async () => {
      if (isCacheValid() && cachedStories.length > 0) {
        setLoading(false);
        return;
      }

      try {
        await fetchStories();
      } catch (err) {
        console.error('Error loading stories:', err);
      }
    };

    loadStories();

    return () => {
      // Cleanup if needed
    };
  }, [fetchStories, isCacheValid, cachedStories.length]);

  return {
    stories: cachedStories,
    loading,
    error,
    refetch: fetchStories,
  };
};

export default useStories;
