import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { MainLayout } from '@/core/layout/MainLayout';
import { ErrorBoundary } from '@/core/layout/ErrorBoundary';
import { LoadingSpinner } from '@/core/layout/LoadingSpinner';
import { I18nRouteWrapper } from '@/core/i18n';

// Lazy load components for better performance
const HomePage = lazy(() => import('@/features/home/pages/HomePage'));
const UsersListPage = lazy(() => import('@/features/users/pages/UsersListPage'));
const UserDetailPage = lazy(() => import('@/features/users/pages/UserDetailPage'));
const NotFoundPage = lazy(() => import('@/core/layout/NotFoundPage'));

/**
 * Root layout component that wraps all routes with i18n support
 */
const RootLayout = () => (
  <ErrorBoundary>
    <I18nRouteWrapper>
      <MainLayout>
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </MainLayout>
    </I18nRouteWrapper>
  </ErrorBoundary>
);

/**
 * Application router configuration with i18n support
 * Supports both /:lang/path and /path (defaults to English)
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: (
      <ErrorBoundary>
        <div>Something went wrong</div>
      </ErrorBoundary>
    ),
    children: [
      // Default language routes (English)
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'users',
        children: [
          {
            index: true,
            element: <UsersListPage />,
          },
          {
            path: ':id',
            element: <UserDetailPage />,
          },
        ],
      },
      // Internationalized routes with language prefix
      {
        path: ':lang',
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'users',
            children: [
              {
                index: true,
                element: <UsersListPage />,
              },
              {
                path: ':id',
                element: <UserDetailPage />,
              },
            ],
          },
        ],
      },
      // Catch-all for 404
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

/**
 * Router Provider Component with i18n support
 * Use this component to wrap your app with routing and i18n capabilities
 */
export const AppRouter = () => <RouterProvider router={router} />;
