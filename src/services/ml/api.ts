import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your API URL
});

// Function to set the authorization token in the request headers
api.setToken = token => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-project-id.cloudfunctions.net', // Replace with your Firebase Cloud Functions URL
});

api.setToken = token => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

api.handleError = error => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Response error:', error.response.data);
    console.error('Status:', error.response.status);
    console.error('Headers:', error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.error('Request error:', error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error:', error.message);
  }
  console.error('Error config:', error.config);

  // You can add more specific error handling logic here, such as
  // displaying error messages to the user or retrying the request.
};

export default api;

// src/services/api/client.ts
import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import Config from 'react-native-config';

interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}

class ApiClient {
  private static instance: AxiosInstance;
  private static retryCount = 3;
  private static retryDelay = 1000;

  static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: Config.API_URL || 'http://localhost:3000',
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      this.setupInterceptors();
    }
    return this.instance;
  }

  private static setupInterceptors() {
    this.instance.interceptors.request.use(
      this.addTimestampToRequest.bind(this),
      this.handleRequestError.bind(this),
    );

    this.instance.interceptors.response.use(
      this.handleResponse.bind(this),
      this.handleResponseError.bind(this),
    );
  }

  private static addTimestampToRequest(
    config: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const url = config.url || '';
    config.url = url + (url.includes('?') ? '&' : '?') + '_ts=' + Date.now();

    // Log requests in development
    if (__DEV__) {
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        data: config.data,
      });
    }

    return config;
  }

  private static handleRequestError(error: AxiosError): Promise<any> {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }

  private static handleResponse(response: AxiosResponse): AxiosResponse {
    if (__DEV__) {
      console.log('API Response:', {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  }

  private static handleResponseError(error: AxiosError): Promise<any> {
    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Implement retry logic for network errors
    if (
      error.message === 'Network Error' &&
      originalRequest._retry !== this.retryCount
    ) {
      originalRequest._retry = (originalRequest._retry || 0) + 1;
      await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      return this.instance(originalRequest);
    }

    return this.handleError(error);
  }

  private static handleError(error: AxiosError<ApiErrorResponse>) {
    const errorResponse: ApiErrorResponse = {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    };

    if (error.response) {
      errorResponse.message = error.response.data?.message || error.message;
      errorResponse.code = error.response.status.toString();
      errorResponse.details = {
        data: error.response.data,
        headers: error.response.headers,
      };
    } else if (error.request) {
      errorResponse.message = 'No response received from server';
      errorResponse.code = 'NO_RESPONSE';
      errorResponse.details = error.request;
    } else {
      errorResponse.message = error.message;
      errorResponse.code = 'REQUEST_SETUP_ERROR';
    }

    // Log error in development
    if (__DEV__) {
      console.error('API Error:', errorResponse);
    }

    return Promise.reject(errorResponse);
  }

  static setToken(token: string | null) {
    if (token) {
      this.instance.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete this.instance.defaults.headers.common.Authorization;
    }
  }

  static setBaseUrl(url: string) {
    this.instance.defaults.baseURL = url;
  }

  static setTimeout(timeout: number) {
    this.instance.defaults.timeout = timeout;
  }
}

export const api = ApiClient.getInstance();
export default api;
