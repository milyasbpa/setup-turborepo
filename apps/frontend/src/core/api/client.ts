import axios from 'axios';

/**
 * Base API Configuration
 * Centralized axios configuration for API calls
 */

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens, logging, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('❌ API Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors, logging, etc.
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }

    return response;
  },
  (error) => {
    // Log error in development
    if (import.meta.env.DEV) {
      console.error('❌ API Response Error:', error.response?.data || error.message);
    }

    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login or clear auth
      localStorage.removeItem('authToken');
      // Could dispatch logout action here if using state management
    }

    if (error.response?.status >= 500) {
      // Server error - could show global error message
      console.error('Server error occurred');
    }

    return Promise.reject(error);
  }
);

/**
 * API Endpoints Configuration
 */
export const API_ENDPOINTS = {
  // Health endpoints
  HEALTH: '/health',
  
  // Lesson endpoints
  LESSONS: '/lessons',
  LESSON_DETAIL: (id: string | number) => `/lessons/${id}`,
  LESSON_SUBMIT: (id: string | number) => `/lessons/${id}/submit`,
  LESSON_STATS: '/lessons/stats',
  
  // Profile endpoints
  PROFILE: '/profile',
  PROFILE_STATS: '/profile/stats',
  
  // User endpoints (legacy)
  USERS: '/users',
  USER_DETAIL: (id: string | number) => `/users/${id}`,
} as const;

/**
 * Common API Response Types
 */
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

/**
 * API Utility Functions
 */
export const apiUtils = {
  /**
   * Check if error is a network error
   */
  isNetworkError: (error: any): boolean => {
    return !error.response && error.code === 'NETWORK_ERROR';
  },

  /**
   * Check if error is a timeout error
   */
  isTimeoutError: (error: any): boolean => {
    return error.code === 'ECONNABORTED';
  },

  /**
   * Get error message from API error
   */
  getErrorMessage: (error: any): string => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },

  /**
   * Check if we're in development mode
   */
  isDevelopment: (): boolean => {
    return import.meta.env.DEV;
  },
};
