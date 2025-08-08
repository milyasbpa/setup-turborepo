import React from 'react';
import type { BaseComponentProps, ApiError } from '@/core/api';

interface ErrorMessageProps extends BaseComponentProps {
  error: ApiError | Error | string;
  onRetry?: () => void;
  showRetry?: boolean;
}

/**
 * Error Message Component
 * Displays error messages with optional retry functionality
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry,
  showRetry = true,
  className = '',
}) => {
  const errorMessage = typeof error === 'string' 
    ? error 
    : error.message || 'An unexpected error occurred';

  return (
    <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-red-800">{errorMessage}</p>
        </div>
        {showRetry && onRetry && (
          <div className="ml-3">
            <button
              onClick={onRetry}
              className="text-sm font-medium text-red-800 hover:text-red-600 underline"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface ErrorScreenProps extends BaseComponentProps {
  error: ApiError | Error | string;
  onRetry?: () => void;
  title?: string;
}

/**
 * Full Screen Error Component
 * Shows error state for entire screen
 */
export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  error,
  onRetry,
  title = 'Something went wrong',
  className = '',
}) => {
  const errorMessage = typeof error === 'string' 
    ? error 
    : error.message || 'An unexpected error occurred';

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 ${className}`}>
      <div className="max-w-md w-full text-center">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 mb-6">{errorMessage}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorScreen
          error={this.state.error?.message || 'A JavaScript error occurred'}
          title="Application Error"
          onRetry={() => {
            this.setState({ hasError: false, error: undefined });
            window.location.reload();
          }}
        />
      );
    }

    return this.props.children;
  }
}
