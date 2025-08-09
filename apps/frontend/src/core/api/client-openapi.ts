import createClient, { type Middleware } from 'openapi-fetch';
import type { paths } from './schema';
import { Environment } from '@/core/config/environment';

/**
 * Create OpenAPI client with base configuration
 */
export const apiClient = createClient<paths>({
  baseUrl: Environment.isLocalhost ? '/' : Environment.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Auth middleware to add JWT token to requests
 */
const authMiddleware: Middleware = {
  onRequest({ request }) {
    const token = localStorage.getItem('authToken');
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
  },
};

/**
 * Logging middleware for development
 */
const loggingMiddleware: Middleware = {
  onRequest({ request }) {
    if (Environment.debugMode) {
      console.log(`🚀 API Request: ${request.method} ${request.url}`);
    }
    return request;
  },
  onResponse({ response }) {
    if (Environment.debugMode) {
      console.log(`✅ API Response: ${response.status} ${response.url}`);
    }
    return response;
  },
};

/**
 * Error handling middleware
 */
const errorMiddleware: Middleware = {
  onResponse({ response }) {
    // Handle 401 errors
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      // Could dispatch logout action here if using state management
    }

    // Log server errors in development
    if (response.status >= 500 && Environment.debugMode) {
      console.error('Server error occurred');
    }

    return response;
  },
};

// Add middlewares to client
apiClient.use(authMiddleware);
apiClient.use(loggingMiddleware);
apiClient.use(errorMiddleware);

/**
 * Helper function to extract data from API response
 * Backend wraps responses in { success, data, message, timestamp }
 */
export function extractData<T>(response: { data?: { success?: boolean; data?: T } }): T | null {
  return response.data?.data || null;
}

/**
 * Helper function to handle API errors
 */
export function getErrorMessage(error: any): string {
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

export default apiClient;
