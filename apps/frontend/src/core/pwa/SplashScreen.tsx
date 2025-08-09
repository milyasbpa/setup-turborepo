import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  isVisible?: boolean;
  appName?: string;
  appTagline?: string;
  logoText?: string;
  duration?: number;
  onComplete?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  isVisible = true,
  appName = 'MathLearn',
  appTagline = 'Interactive Math Learning',
  logoText = 'ML',
  duration = 2500,
  onComplete
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [shouldShow, setShouldShow] = useState(isVisible);

  useEffect(() => {
    if (!isVisible) {
      setShouldShow(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsExiting(true);
      
      // Wait for exit animation to complete
      setTimeout(() => {
        setShouldShow(false);
        onComplete?.();
      }, 500);
    }, duration);

    return () => clearTimeout(timer);
  }, [isVisible, duration, onComplete]);

  // Don't render if not visible and not exiting
  if (!shouldShow && !isExiting) {
    return null;
  }

  return (
    <div 
      className={`
        fixed inset-0 splash-gradient flex flex-col items-center justify-center z-[9999]
        ${shouldShow ? 'animate-fade-in' : ''}
        ${isExiting ? 'animate-fade-out' : ''}
      `}
      style={{ 
        visibility: shouldShow ? 'visible' : 'hidden'
      }}
    >
      {/* Logo Container */}
      <div className="flex flex-col items-center gap-5">
        {/* App Logo */}
        <div className="w-30 h-30 bg-white rounded-3xl flex items-center justify-center text-5xl font-bold text-blue-600 app-logo animate-pulse-slow">
          {logoText}
        </div>
        
        {/* App Info */}
        <div className="text-center">
          <h1 className="text-white text-3xl font-semibold mb-2 drop-shadow-lg">
            {appName}
          </h1>
          <p className="text-white/90 text-base font-light">
            {appTagline}
          </p>
        </div>
      </div>
      
      {/* Loading Container */}
      <div className="mt-10 flex flex-col items-center gap-4">
        <div className="text-white/80 text-sm font-normal">
          Loading...
        </div>
        
        {/* Loading Bar */}
        <div className="w-50 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/80 to-transparent animate-progress" />
        </div>
      </div>
    </div>
  );
};

/**
 * Hook to manage splash screen for PWA
 */
export function useSplashScreen(options: {
  showOnPWA?: boolean;
  duration?: number;
  forceShow?: boolean;
} = {}) {
  const { showOnPWA = true, forceShow = false } = options;
  const [isVisible, setIsVisible] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Check if app is running as PWA
    const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                  window.matchMedia('(display-mode: fullscreen)').matches ||
                  (window.navigator as any).standalone === true;

    // Show splash screen if:
    // 1. Force show is enabled, OR
    // 2. Running as PWA and showOnPWA is true, OR
    // 3. App was just installed (check session storage)
    const justInstalled = sessionStorage.getItem('pwa-just-installed') === 'true';
    
    if (forceShow || (isPWA && showOnPWA) || justInstalled) {
      setIsVisible(true);
      
      // Clear the just installed flag
      if (justInstalled) {
        sessionStorage.removeItem('pwa-just-installed');
      }
    } else {
      setIsComplete(true);
    }

    // Listen for PWA installation
    const handlePWAInstalled = () => {
      sessionStorage.setItem('pwa-just-installed', 'true');
    };

    window.addEventListener('pwa-installed', handlePWAInstalled);
    
    return () => {
      window.removeEventListener('pwa-installed', handlePWAInstalled);
    };
  }, [showOnPWA, forceShow]);

  const handleComplete = () => {
    setIsVisible(false);
    setIsComplete(true);
  };

  return {
    isVisible,
    isComplete,
    showSplash: () => setIsVisible(true),
    hideSplash: () => setIsVisible(false),
    onComplete: handleComplete
  };
}
