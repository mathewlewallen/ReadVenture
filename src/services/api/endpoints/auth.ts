// src/services/api/endpoints/auth.ts
import { api } from '../client';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '../../../types';

export const authEndpoints = {
  login: (credentials: LoginCredentials) => api.post<AuthResponse>('/auth/login', credentials),

  register: (credentials: RegisterCredentials) =>
    api.post<AuthResponse>('/auth/register', credentials),

  logout: () => api.post('/auth/logout'),
};
