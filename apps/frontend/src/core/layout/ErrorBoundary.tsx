import { Component, ReactNode, ErrorInfo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation, useLocalizedRoutes } from '@/core/i18n';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorFallbackProps {
  error?: Error;
  onRetry: () => void;
}

/**
 * Error Fallback UI component with i18n support
 */
const ErrorFallback = ({ error, onRetry }: ErrorFallbackProps) => {
  const { t } = useTranslation('common');
  const { routes } = useLocalizedRoutes();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-800 text-white p-8">
      <div className="text-center max-w-2xl bg-white/10 p-12 rounded-xl backdrop-blur-md mx-4">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-3xl font-bold mb-4 text-red-400 md:text-2xl">
          {t('error.title', { defaultValue: 'Oops! Something went wrong' })}
        </h1>
        <p className="text-lg mb-8 text-gray-300 leading-relaxed">
          {t('error.message', { 
            defaultValue: "We're sorry, but something unexpected happened. Please try refreshing the page." 
          })}
        </p>
        
        {import.meta.env.DEV && error && (
          <details className="text-left my-8 bg-black/30 rounded-lg p-4">
            <summary className="cursor-pointer text-cyan-400 mb-4 hover:text-cyan-300">
              {t('error.details', { defaultValue: 'Error Details (Development)' })}
            </summary>
            <pre className="text-red-400 text-sm overflow-x-auto whitespace-pre-wrap break-words">
              <strong>Error:</strong> {error.message}
              {error.stack && (
                <>
                  <br />
                  <strong>Stack Trace:</strong>
                  <br />
                  {error.stack}
                </>
              )}
            </pre>
          </details>
        )}
        
        <div className="flex gap-4 justify-center flex-wrap md:flex-col md:items-center">
          <button 
            onClick={onRetry} 
            className="px-6 py-3 bg-cyan-400 text-slate-800 rounded-lg font-medium text-base border-none cursor-pointer transition-all duration-300 hover:bg-cyan-500 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800 md:w-full md:max-w-xs"
          >
            {t('tryAgain')}
          </button>
          <Link 
            to={routes.home} 
            className="px-6 py-3 bg-transparent text-cyan-400 border-2 border-cyan-400 rounded-lg font-medium text-base no-underline transition-all duration-300 hover:bg-cyan-400 hover:text-slate-800 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800 md:w-full md:max-w-xs"
          >
            {t('goHome')}
          </Link>
        </div>
      </div>
    </div>
  );
};

/**
 * Error Boundary component to catch and handle React errors gracefully
 * Provides a fallback UI when component tree crashes
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // In production, you might want to log to an error reporting service
    // Example: logErrorToService(error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI with i18n support
      return (
        <ErrorFallback 
          error={this.state.error}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}
