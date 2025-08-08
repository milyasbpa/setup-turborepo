/**
 * Core Module Exports
 * Centralized exports for all core functionality
 */

// Router exports
export { ROUTES, I18N_ROUTES, routeUtils } from '@/core/router/routes';
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

// Query exports (React Query/TanStack Query)
export {
  queryClient,
  QueryProvider,
  queryKeys,
  useInvalidateQueries,
  useRemoveQueries,
  useOptimisticUpdate,
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  useSuspenseQuery,
  type MutationOptions,
  type UseQueryOptions,
  type UseMutationOptions,
  type UseInfiniteQueryOptions,
} from '@/core/query';

// PWA exports (Progressive Web App)
export {
  pwaManager,
  notificationManager,
  usePWA,
  useNotifications,
  useNetworkStatus,
  UpdatePrompt,
  InstallPrompt,
  NetworkStatus,
  type NotificationOptions,
  type PushSubscriptionData,
  type PWAState,
  type PWAActions,
} from '@/core/pwa';

// i18n exports (Internationalization)
export {
  i18n,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  FALLBACK_LANGUAGE,
  useTranslation,
  useLanguage,
  useLocalizedRoutes,
  useFormatter,
  getBrowserLanguage,
  languageStorage,
  LanguageSwitcher,
  I18nRouteWrapper,
  LocalizedLink,
  Trans,
  Translation,
  type SupportedLanguage,
} from '@/core/i18n';

// Type exports for routing
export type { RouteKeys, RouteValues, I18nRouteValues } from '@/core/router/routes';
