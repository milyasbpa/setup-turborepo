import React from 'react';
import type { BaseComponentProps } from '@/core/api';

interface LoadingSpinnerProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
}

/**
 * Loading Spinner Component
 * Reusable loading indicator with different sizes and colors
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
  };

  return (
    <div className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
      <svg
        className="w-full h-full"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

interface LoadingScreenProps extends BaseComponentProps {
  message?: string;
}

/**
 * Full Screen Loading Component
 * Shows loading spinner with optional message
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gray-50 ${className}`}>
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-lg text-gray-600 font-medium">{message}</p>
    </div>
  );
};

interface LoadingCardProps extends BaseComponentProps {
  message?: string;
}

/**
 * Card Loading Component
 * Shows loading state within a card or section
 */
export const LoadingCard: React.FC<LoadingCardProps> = ({
  message = 'Loading...',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow ${className}`}>
      <LoadingSpinner size="md" />
      <p className="mt-3 text-sm text-gray-500">{message}</p>
    </div>
  );
};
