import { Component, ReactNode, ErrorInfo } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/core/router/routes';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

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

      // Default error UI
      return (
        <div className="error-boundary">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h1>Oops! Something went wrong</h1>
            <p className="error-message">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            
            {import.meta.env.DEV && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development)</summary>
                <pre className="error-stack">
                  <strong>Error:</strong> {this.state.error.message}
                  {this.state.error.stack && (
                    <>
                      <br />
                      <strong>Stack Trace:</strong>
                      <br />
                      {this.state.error.stack}
                    </>
                  )}
                </pre>
              </details>
            )}
            
            <div className="error-actions">
              <button onClick={this.handleRetry} className="retry-button">
                Try Again
              </button>
              <Link to={ROUTES.HOME} className="home-button">
                Go Home
              </Link>
            </div>
          </div>

          <style>{`
            .error-boundary {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #282c34;
              color: white;
              padding: 2rem;
            }

            .error-content {
              text-align: center;
              max-width: 600px;
              background: rgba(255, 255, 255, 0.1);
              padding: 3rem;
              border-radius: 12px;
              backdrop-filter: blur(10px);
            }

            .error-icon {
              font-size: 4rem;
              margin-bottom: 1rem;
            }

            .error-content h1 {
              font-size: 2rem;
              margin-bottom: 1rem;
              color: #ff6b6b;
            }

            .error-message {
              font-size: 1.1rem;
              margin-bottom: 2rem;
              color: #ccc;
              line-height: 1.6;
            }

            .error-details {
              text-align: left;
              margin: 2rem 0;
              background: rgba(0, 0, 0, 0.3);
              border-radius: 8px;
              padding: 1rem;
            }

            .error-details summary {
              cursor: pointer;
              color: #61dafb;
              margin-bottom: 1rem;
            }

            .error-stack {
              color: #ff6b6b;
              font-size: 0.9rem;
              overflow-x: auto;
              white-space: pre-wrap;
              word-break: break-word;
            }

            .error-actions {
              display: flex;
              gap: 1rem;
              justify-content: center;
              flex-wrap: wrap;
            }

            .retry-button,
            .home-button {
              padding: 0.75rem 1.5rem;
              border-radius: 8px;
              text-decoration: none;
              font-weight: 500;
              transition: all 0.3s ease;
              border: none;
              cursor: pointer;
              font-size: 1rem;
            }

            .retry-button {
              background: #61dafb;
              color: #282c34;
            }

            .retry-button:hover {
              background: #21a1c4;
              transform: translateY(-2px);
            }

            .home-button {
              background: transparent;
              color: #61dafb;
              border: 2px solid #61dafb;
            }

            .home-button:hover {
              background: #61dafb;
              color: #282c34;
              transform: translateY(-2px);
            }

            @media (max-width: 768px) {
              .error-content {
                padding: 2rem;
                margin: 1rem;
              }

              .error-content h1 {
                font-size: 1.5rem;
              }

              .error-actions {
                flex-direction: column;
                align-items: center;
              }

              .retry-button,
              .home-button {
                width: 100%;
                max-width: 200px;
              }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}
