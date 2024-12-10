/**
 * API Service
 *
 * Handles HTTP requests with proper error handling, type safety, and security.
 * Integrates with Firebase Cloud Functions and implements request/response interceptors.
 *
 * @packageDocumentation
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import Config from 'react-native-config';

import { store } from '../store';
import { setLoading, setError } from '../store/appSlice';
import { ApiResponse, PaginatedResponse } from '../types';
import { logError } from '../utils/analytics';

/**
 * API configuration interface
 */
interface ApiConfig extends AxiosRequestConfig {
  retryAttempts?: number;
  retryDelay?: number;
}

/**
 * API error interface
 */
interface ApiError extends Error {
  code: string;
  response?: any;
  config?: AxiosRequestConfig;
}

/**
 * Creates and configures API client
 */
class ApiService {
  private static instance: ApiService;
  private api: AxiosInstance;
  private retryAttempts: number;
  private retryDelay: number;

  private constructor() {
    this.retryAttempts = 3;
    this.retryDelay = 1000;

    this.api = axios.create({
      baseURL: Config.API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Gets singleton instance
   */
  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  /**
   * Sets up request/response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      config => {
        store.dispatch(setLoading(true));

        // Add auth token if available
        const token = store.getState().auth.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        store.dispatch(setLoading(false));
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.api.interceptors.response.use(
      response => {
        store.dispatch(setLoading(false));
        return response;
      },
      error => {
        store.dispatch(setLoading(false));
        store.dispatch(setError(error.message));
        logError(error);
        return Promise.reject(error);
      },
    );
  }

  /**
   * Makes a GET request
   */
  public async get<T>(
    url: string,
    config?: ApiConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Makes a POST request
   */
  public async post<T>(
    url: string,
    data: any,
    config?: ApiConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Handles API errors
   */
  private handleError(error: AxiosError<ApiError>): void {
    const apiError: ApiError = {
      name: 'ApiError',
      message: error.message,
      code: error.code || 'UNKNOWN_ERROR',
      response: error.response,
      config: error.config,
    };

    if (error.response) {
      apiError.message = error.response.data?.message || error.message;
      apiError.code = error.response.status.toString();
    } else if (error.request) {
      apiError.message = 'No response received from server';
      apiError.code = 'NO_RESPONSE';
    }

    // Log error in development
    if (__DEV__) {
      console.error('API Error:', apiError);
    }

    throw apiError;
  }
}

export const apiService = ApiService.getInstance();
export default apiService;
