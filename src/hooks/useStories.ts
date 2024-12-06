// src/hooks/useStories.ts
import { useState, useEffect } from 'react';
import { databaseService } from '../services/firebase/database.service';
import { Story } from '../types/firebase.types';

export const useStories = (difficulty?: number, ageRange?: number[]) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadStories = async () => {
      try {
        const data = await databaseService.getStories(difficulty, ageRange);
        setStories(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, [difficulty, ageRange?.join()]);

  return { stories, loading, error };
};
