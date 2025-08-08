import { useState, useEffect, useCallback } from 'react';
import { pwaManager } from './PWAManager';
import { notificationManager } from './NotificationManager';

export interface PWAState {
  isInstalled: boolean;
  canInstall: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
  installing: boolean;
}

export interface PWAActions {
  installApp: () => Promise<boolean>;
  updateApp: () => Promise<void>;
  dismissUpdate: () => void;
}

/**
 * Hook for PWA functionality
 */
export function usePWA(): PWAState & PWAActions {
  const [state, setState] = useState<PWAState>({
    isInstalled: false,
    canInstall: false,
    isOnline: navigator.onLine,
    updateAvailable: false,
    installing: false,
  });

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Initialize PWA
  useEffect(() => {
    const initPWA = async () => {
      await pwaManager.init();
      
      // Set notification manager registration
      const registration = pwaManager.getRegistration();
      notificationManager.setRegistration(registration);

      // Update initial state
      setState(prev => ({
        ...prev,
        isInstalled: pwaManager.isInstalled(),
        canInstall: pwaManager.canInstall(),
        isOnline: pwaManager.isOnline(),
      }));
    };

    initPWA();
  }, []);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
      notificationManager.showOnlineNotification();
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
      notificationManager.showOfflineNotification();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Listen for PWA events
  useEffect(() => {
    const handleUpdateAvailable = () => {
      setState(prev => ({ ...prev, updateAvailable: true }));
    };

    const handleUpdateDismissed = () => {
      setState(prev => ({ ...prev, updateAvailable: false }));
    };

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setState(prev => ({ ...prev, canInstall: true }));
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setState(prev => ({ 
        ...prev, 
        isInstalled: true, 
        canInstall: false,
        installing: false 
      }));
    };

    window.addEventListener('pwa-update-available', handleUpdateAvailable);
    window.addEventListener('pwa-update-dismissed', handleUpdateDismissed);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('pwa-update-available', handleUpdateAvailable);
      window.removeEventListener('pwa-update-dismissed', handleUpdateDismissed);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Install app
  const installApp = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) return false;

    setState(prev => ({ ...prev, installing: true }));

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA: User accepted installation');
        return true;
      } else {
        console.log('PWA: User dismissed installation');
        setState(prev => ({ ...prev, installing: false }));
        return false;
      }
    } catch (error) {
      console.error('PWA: Installation failed:', error);
      setState(prev => ({ ...prev, installing: false }));
      return false;
    }
  }, [deferredPrompt]);

  // Update app
  const updateApp = useCallback(async (): Promise<void> => {
    await pwaManager.skipWaiting();
  }, []);

  // Dismiss update
  const dismissUpdate = useCallback((): void => {
    pwaManager.dismissUpdate();
  }, []);

  return {
    ...state,
    installApp,
    updateApp,
    dismissUpdate,
  };
}

/**
 * Hook for notification functionality
 */
export function useNotifications() {
  const [permission, setPermission] = useState<string>('default');
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    setPermission(notificationManager.getPermission());
  }, []);

  const requestPermission = useCallback(async (): Promise<string> => {
    const result = await notificationManager.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const showNotification = useCallback(async (options: {
    title: string;
    body?: string;
    icon?: string;
    tag?: string;
  }): Promise<void> => {
    await notificationManager.showNotification(options);
  }, []);

  const subscribeToPush = useCallback(async (vapidKey: string): Promise<any> => {
    const sub = await notificationManager.subscribeToPush(vapidKey);
    setSubscription(sub);
    return sub;
  }, []);

  const unsubscribeFromPush = useCallback(async (): Promise<boolean> => {
    const result = await notificationManager.unsubscribeFromPush();
    if (result) {
      setSubscription(null);
    }
    return result;
  }, []);

  return {
    permission,
    subscription,
    isSupported: notificationManager.isSupported(),
    isPushSupported: notificationManager.isPushSupported(),
    requestPermission,
    showNotification,
    subscribeToPush,
    unsubscribeFromPush,
  };
}

/**
 * Hook for network status
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setWasOffline(false);
        // Could trigger sync or other recovery actions here
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  return {
    isOnline,
    wasOffline,
  };
}
