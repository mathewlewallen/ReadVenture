// src/services/api/endpoints/auth.ts
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from '../../../types';
import { api } from './client';

export const authEndpoints = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthResponse>('/auth/login', credentials),

  register: (credentials: RegisterCredentials) =>
    api.post<AuthResponse>('/auth/register', credentials),

  logout: () => api.post('/auth/logout'),
};
