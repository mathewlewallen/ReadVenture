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
import {
  fetchStoriesStart,
  fetchStoriesSuccess,
  fetchStoriesFailure,
} from '../store/storySlice';
import type { Story, RootState } from '../types';
import { logError } from '../utils/analytics';

interface UseStoriesOptions {
  /** Difficulty level (1-10) */
  difficulty?: number;
  /** Target age range [min, max] */
  ageRange?: [number, number];
  /** Maximum number of stories to fetch */
  limit?: number;
  /** Cache duration in milliseconds */
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
    if (
      ageRange &&
      (ageRange.length !== 2 ||
        ageRange[0] > ageRange[1] ||
        ageRange[0] < 4 ||
        ageRange[1] > 12)
    ) {
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

      // Build query parameters
      const queryParams = {
        ...(difficulty && { difficulty }),
        ...(ageRange && { ageRange }),
        limit,
      };

      // Fetch stories from database
      const stories = await databaseService.getStories(queryParams);

      // Update Redux store
      dispatch(
        fetchStoriesSuccess({
          items: stories,
          lastFetch: Date.now(),
        }),
      );

      setLoading(false);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to fetch stories');
      setError(error);
      dispatch(fetchStoriesFailure(error.message));
      logError('Story fetch failed', error);
      setLoading(false);
    }
  }, [dispatch, difficulty, ageRange, limit, validateParams]);

  /**
   * Checks if cache is valid
   */
  const isCacheValid = useCallback(() => {
    if (!lastFetch || !cachedStories.length) {
      return false;
    }
    return Date.now() - lastFetch < cacheTime;
  }, [lastFetch, cachedStories, cacheTime]);

  /**
   * Effect to fetch stories on mount or when params change
   */
  useEffect(() => {
    if (!isCacheValid()) {
      fetchStories();
    } else {
      setLoading(false);
    }

    // Cleanup function
    return () => {
      setLoading(false);
      setError(null);
    };
  }, [fetchStories, isCacheValid]);

  // Return hook result
  return {
    stories: cachedStories,
    loading,
    error,
    refetch: fetchStories,
  };
};

export default useStories;
