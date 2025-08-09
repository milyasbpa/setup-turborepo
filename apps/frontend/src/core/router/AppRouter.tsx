import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { MainLayout } from '@/core/layout/MainLayout';
import { ErrorBoundary } from '@/core/layout/ErrorBoundary';
import { LoadingSpinner } from '@/core/layout/LoadingSpinner';
import { I18nRouteWrapper } from '@/core/i18n';

// Lazy load components for better performance
// Math Learning App Pages
const LessonsListPage = lazy(() => import('@/features/lessons/pages/LessonsListPage'));
const LessonDetailPage = lazy(() => import('@/features/lessons/pages/LessonDetailPage'));
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'));
const ResultsPage = lazy(() => import('@/features/results/pages/ResultsPage'));
const RecommendationsPage = lazy(() => import('@/features/recommendations/pages/RecommendationsPage'));

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
 * Application router configuration with proper i18n support
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
      // Default language routes (English) - Main App Routes
      {
        index: true,
        element: <LessonsListPage />,
      },
      {
        path: 'lessons',
        children: [
          {
            index: true,
            element: <LessonsListPage />,
          },
          {
            path: ':id',
            element: <LessonDetailPage />,
          },
        ],
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'results',
        element: <ResultsPage />,
      },
      {
        path: 'recommendations',
        element: <RecommendationsPage />,
      },
      // Internationalized routes with language prefix
      {
        path: ':lang',
        children: [
          {
            index: true,
            element: <LessonsListPage />,
          },
          {
            path: 'lessons',
            children: [
              {
                index: true,
                element: <LessonsListPage />,
              },
              {
                path: ':id',
                element: <LessonDetailPage />,
              },
            ],
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
          {
            path: 'results',
            element: <ResultsPage />,
          },
          {
            path: 'recommendations',
            element: <RecommendationsPage />,
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
