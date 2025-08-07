/**
 * Core Module Exports
 * Centralized exports for all core functionality
 */

// Router exports
export { ROUTES, routeUtils } from '@/core/router/routes';
export { AppRouter, router } from '@/core/router/AppRouter';

// Layout exports
export { MainLayout } from '@/core/layout/MainLayout';
export { ErrorBoundary } from '@/core/layout/ErrorBoundary';
export { LoadingSpinner, InlineSpinner, FullscreenLoader } from '@/core/layout/LoadingSpinner';

// API exports
export { 
  apiClient, 
  API_ENDPOINTS, 
  apiUtils,
  type ApiResponse, 
  type PaginatedResponse, 
  type ApiError 
} from '@/core/api/client';

// Type exports for routing
export type { RouteKeys, RouteValues } from '@/core/router/routes';
