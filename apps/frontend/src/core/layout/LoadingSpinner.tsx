/**
 * Loading Spinner Component
 * Shows a beautiful loading animation while content is being loaded
 */
export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[300px] w-full">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-cyan-200 border-l-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-cyan-400 text-lg m-0 animate-pulse">Loading...</p>
      </div>
    </div>
  );
};

/**
 * Inline Loading Spinner for smaller components
 */
export const InlineSpinner = ({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) => {
  const sizeClasses = {
    small: 'w-7 h-7 border-3',
    medium: 'w-12 h-12 border-4', 
    large: 'w-16 h-16 border-5'
  };

  return (
    <div className="text-center">
      <div className={`${sizeClasses[size]} border-cyan-200 border-l-cyan-400 rounded-full animate-spin mx-auto`}></div>
    </div>
  );
};

/**
 * Fullscreen Loading Overlay
 */
export const FullscreenLoader = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <div className="fixed inset-0 bg-slate-800/90 backdrop-blur-sm z-[9999]">
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-200 border-l-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 text-lg m-0 animate-pulse">{message}</p>
        </div>
      </div>
    </div>
  );
};
