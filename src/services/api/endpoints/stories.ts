/**
 * Story API Endpoints Service
 *
 * Handles all story-related API calls with proper error handling,
 * pagination, and caching support.
 *
 * @packageDocumentation
 */

import { AxiosError } from 'axios';

import { store } from '../../../store';
import {
  ApiResponse,
  PaginatedResponse,
  Story,
  StoryFilters,
} from '../../../types';
import { logError } from '../../../utils/analytics';
import { validateStoryData } from '../../../utils/validation';

import { api } from './client';

/**
 * Story API endpoints and handlers
 */
export const storyEndpoints = {
  /**
   * Fetches paginated list of stories with optional filters
   * @param page - Page number to fetch
   * @param filters - Optional filtering criteria
   * @throws {ApiError} When request fails
   */
  getStories: async (
    page: number = 1,
    filters?: StoryFilters,
  ): Promise<PaginatedResponse<Story>> => {
    try {
      const response = await api.get<PaginatedResponse<Story>>('/stories', {
        params: {
          page,
          ...filters,
        },
        headers: {
          'Cache-Control': 'max-age=300', // 5 minute cache
          Authorization: `Bearer ${store.getState().auth.token}`,
        },
      });

      return response.data;
    } catch (error) {
      logError('Failed to fetch stories:', error);
      throw new Error(
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to fetch stories',
      );
    }
  },

  /**
   * Fetches a single story by ID
   * @param id - Story ID to fetch
   * @throws {ApiError} When request fails
   */
  getStoryById: async (id: string): Promise<Story> => {
    try {
      const response = await api.get<ApiResponse<Story>>(`/stories/${id}`, {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`,
        },
      });

      const story = response.data.data;
      validateStoryData(story);

      return story;
    } catch (error) {
      logError('Failed to fetch story:', error);
      throw new Error(
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Failed to fetch story',
      );
    }
  },
};
