import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ROUTES } from './routes';
import { MainLayout } from '@/core/layout/MainLayout';
import { ErrorBoundary } from '@/core/layout/ErrorBoundary';
import { LoadingSpinner } from '@/core/layout/LoadingSpinner';

// Lazy load components for better performance
const HomePage = lazy(() => import('@/features/home/pages/HomePage'));
const UsersListPage = lazy(() => import('@/features/users/pages/UsersListPage'));
const UserDetailPage = lazy(() => import('@/features/users/pages/UserDetailPage'));
const NotFoundPage = lazy(() => import('@/core/layout/NotFoundPage'));

/**
 * Root layout component that wraps all routes
 */
const RootLayout = () => (
  <ErrorBoundary>
    <MainLayout>
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
    </MainLayout>
  </ErrorBoundary>
);

/**
 * Application router configuration
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
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ROUTES.USERS,
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
      {
        path: ROUTES.NOT_FOUND,
        element: <NotFoundPage />,
      },
    ],
  },
]);

/**
 * Router Provider Component
 * Use this component to wrap your app with routing capabilities
 */
export const AppRouter = () => <RouterProvider router={router} />;
