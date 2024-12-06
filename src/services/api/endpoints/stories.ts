// src/services/api/endpoints/stories.ts
import { api } from '../client';
import { Story, PaginatedResponse } from '../../../types';

export const storyEndpoints = {
  getStories: (page: number = 1) =>
    api.get<PaginatedResponse<Story>>('/stories', { params: { page } }),

  getStoryById: (id: string) => api.get<Story>(`/stories/${id}`),
};
