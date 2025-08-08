/**
 * Application Routes Configuration
 * Centralized route definitions for the entire application
 * Supports internationalization with language prefixes
 */

export const ROUTES = {
  HOME: '/',
  USERS: '/users',
  USER_DETAIL: '/users/:id',
  NOT_FOUND: '*',
} as const;

// Language-aware routes
export const I18N_ROUTES = {
  HOME: '/:lang?',
  USERS: '/:lang?/users',
  USER_DETAIL: '/:lang?/users/:id',
  NOT_FOUND: '*',
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type RouteValues = typeof ROUTES[RouteKeys];
export type I18nRouteValues = typeof I18N_ROUTES[RouteKeys];

/**
 * Route utility functions
 */
export const routeUtils = {
  /**
   * Generate user detail route with ID
   */
  userDetail: (id: string | number) => `/users/${id}`,

  /**
   * Generate localized user detail route with ID and language
   */
  localizedUserDetail: (id: string | number, lang?: string) => 
    lang ? `/${lang}/users/${id}` : `/users/${id}`,

  /**
   * Check if current path matches route
   */
  isCurrentRoute: (currentPath: string, route: RouteValues) => {
    if (route.includes(':')) {
      const pattern = route.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(currentPath);
    }
    return currentPath === route;
  },

  /**
   * Get route title for navigation
   */
  getRouteTitle: (route: RouteValues): string => {
    const titles: Record<string, string> = {
      '/': 'Home',
      '/users': 'Users',
      '/users/:id': 'User Details',
    };
    return titles[route] || 'Page';
  },

  /**
   * Extract language from path
   */
  extractLanguageFromPath: (path: string): { language: string | null; pathWithoutLang: string } => {
    const segments = path.split('/').filter(Boolean);
    const supportedLangs = ['en', 'id']; // Should match SUPPORTED_LANGUAGES
    
    if (segments.length > 0 && supportedLangs.includes(segments[0])) {
      return {
        language: segments[0],
        pathWithoutLang: '/' + segments.slice(1).join('/') || '/',
      };
    }
    
    return {
      language: null,
      pathWithoutLang: path,
    };
  },

  /**
   * Build localized path
   */
  buildLocalizedPath: (path: string, language?: string): string => {
    if (!language || language === 'en') {
      return path;
    }
    
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `/${language}${cleanPath}`;
  },
};
