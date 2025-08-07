/**
 * Application Routes Configuration
 * Centralized route definitions for the entire application
 */

export const ROUTES = {
  HOME: '/',
  USERS: '/users',
  USER_DETAIL: '/users/:id',
  NOT_FOUND: '*',
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type RouteValues = typeof ROUTES[RouteKeys];

/**
 * Route utility functions
 */
export const routeUtils = {
  /**
   * Generate user detail route with ID
   */
  userDetail: (id: string | number) => `/users/${id}`,

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
};
