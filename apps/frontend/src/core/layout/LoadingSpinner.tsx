/**
 * Loading Spinner Component
 * Shows a beautiful loading animation while content is being loaded
 */
export const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p className="loading-text">Loading...</p>
      </div>

      <style>{`
        .loading-spinner-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          width: 100%;
        }

        .loading-spinner {
          text-align: center;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(97, 218, 251, 0.2);
          border-left: 4px solid #61dafb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        .loading-text {
          color: #61dafb;
          font-size: 1.1rem;
          margin: 0;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Alternative loading states */
        .loading-spinner.small .spinner {
          width: 30px;
          height: 30px;
          border-width: 3px;
        }

        .loading-spinner.large .spinner {
          width: 70px;
          height: 70px;
          border-width: 5px;
        }

        .loading-spinner.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(40, 44, 52, 0.9);
          backdrop-filter: blur(5px);
          z-index: 9999;
        }

        .loading-spinner.fullscreen .loading-spinner-container {
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
};

/**
 * Inline Loading Spinner for smaller components
 */
export const InlineSpinner = ({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) => {
  return (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner"></div>
    </div>
  );
};

/**
 * Fullscreen Loading Overlay
 */
export const FullscreenLoader = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <div className="loading-spinner fullscreen">
      <div className="loading-spinner-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p className="loading-text">{message}</p>
        </div>
      </div>
    </div>
  );
};
