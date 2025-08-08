import { useState, useEffect } from 'react';
import { usePWA } from './hooks';

interface UpdatePromptProps {
  onUpdate?: () => void;
  onDismiss?: () => void;
}

/**
 * Component to prompt user for app updates
 */
export function UpdatePrompt({ onUpdate, onDismiss }: UpdatePromptProps) {
  const { updateAvailable, updateApp, dismissUpdate } = usePWA();

  if (!updateAvailable) return null;

  const handleUpdate = async () => {
    await updateApp();
    onUpdate?.();
  };

  const handleDismiss = () => {
    dismissUpdate();
    onDismiss?.();
  };

  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm z-50">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">App Update Available</h3>
          <p className="text-sm text-gray-500 mt-1">A new version is ready to install.</p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-3 py-1.5 text-xs font-medium rounded hover:bg-blue-700 transition-colors"
            >
              Update Now
            </button>
            <button
              onClick={handleDismiss}
              className="bg-gray-100 text-gray-700 px-3 py-1.5 text-xs font-medium rounded hover:bg-gray-200 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface InstallPromptProps {
  onInstall?: () => void;
  onDismiss?: () => void;
}

/**
 * Enhanced component to prompt user for app installation (Android PWA)
 */
export function InstallPrompt({ onInstall, onDismiss }: InstallPromptProps) {
  const { canInstall, installApp } = usePWA();
  const [isInstalling, setIsInstalling] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    setShowPrompt(canInstall);
  }, [canInstall]);

  if (!showPrompt) return null;

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await installApp();
      if (success) {
        setShowPrompt(false);
        onInstall?.();
      }
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    onDismiss?.();
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 mx-auto max-w-sm z-50">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6">
        <div className="text-center">
          {/* App Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            TA
          </div>
          
          {/* Content */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Install TurboApp
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Install our app for a better experience with offline access and faster loading.
          </p>
          
          {/* Features */}
          <div className="space-y-2 mb-6 text-left">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <span className="text-sm text-gray-700">Works offline</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <span className="text-sm text-gray-700">Fast loading</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <span className="text-sm text-gray-700">Push notifications</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleDismiss}
              disabled={isInstalling}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Not now
            </button>
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
            >
              {isInstalling ? 'Installing...' : 'Install'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface NetworkStatusProps {
  isOnline?: boolean;
}

/**
 * Component to show network connection status
 */
export function NetworkStatus({ isOnline }: NetworkStatusProps) {
  const { isOnline: pwaOnlineStatus } = usePWA();
  const [showStatus, setShowStatus] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
  
  const online = isOnline ?? pwaOnlineStatus;

  useEffect(() => {
    if (!online) {
      setWasOffline(true);
      setShowStatus(true);
    } else if (wasOffline) {
      setShowStatus(true);
      const timer = setTimeout(() => setShowStatus(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [online, wasOffline]);

  if (!showStatus) return null;

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-40 px-4 py-2 rounded-full text-sm font-medium ${
      online 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      <div className="flex items-center gap-2">
        {online ? (
          <>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Back online</span>
          </>
        ) : (
          <>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>You're offline</span>
          </>
        )}
      </div>
    </div>
  );
}
