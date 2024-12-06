// src/services/api/endpoints/stories.ts
import { PaginatedResponse, Story } from '../../../types';
import { api } from './client';

export const storyEndpoints = {
  getStories: (page: number = 1) =>
    api.get<PaginatedResponse<Story>>('/stories', { params: { page } }),

  getStoryById: (id: string) => api.get<Story>(`/stories/${id}`),
};
