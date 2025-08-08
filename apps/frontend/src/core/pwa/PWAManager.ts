import { Workbox } from 'workbox-window';

export class PWAManager {
  private wb: Workbox | null = null;
  private registration: ServiceWorkerRegistration | null = null;
  private refreshing = false;
  private deferredPrompt: any = null;
  private installPromptShown = false;

  /**
   * Initialize PWA functionality
   */
  async init(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers are not supported in this browser');
      return;
    }

    // Initialize Workbox
    this.wb = new Workbox('/sw.js', {
      scope: '/',
    });

    // Set up event listeners
    this.setupEventListeners();
    this.setupInstallPromptListeners();

    try {
      // Register service worker
      this.registration = (await this.wb.register()) || null;
      console.log('PWA: Service worker registered successfully');
    } catch (error) {
      console.error('PWA: Service worker registration failed:', error);
    }
  }

  /**
   * Set up service worker event listeners
   */
  private setupEventListeners(): void {
    if (!this.wb) return;

    // Listen for waiting service worker
    this.wb.addEventListener('waiting', () => {
      console.log('PWA: New service worker waiting');
      this.showUpdatePrompt();
    });

    // Listen for controlling service worker change
    this.wb.addEventListener('controlling', () => {
      console.log('PWA: New service worker is controlling');
      if (this.refreshing) return;
      this.refreshing = true;
      window.location.reload();
    });

    // Listen for service worker updates
    this.wb.addEventListener('installed', (event) => {
      if (event.isUpdate) {
        console.log('PWA: Service worker updated');
      } else {
        console.log('PWA: Service worker installed for the first time');
      }
    });
  }

  /**
   * Set up install prompt event listeners
   */
  private setupInstallPromptListeners(): void {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('PWA: beforeinstallprompt event triggered');
      
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      // Save the event so it can be triggered later
      this.deferredPrompt = e;
      
      // Show custom install prompt if not shown yet and user hasn't installed
      if (!this.installPromptShown && !this.isInstalled()) {
        this.showInstallPrompt();
      }
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      console.log('PWA: App was installed');
      this.deferredPrompt = null;
      this.installPromptShown = true;
      
      // Dispatch event for UI components
      window.dispatchEvent(new CustomEvent('pwa-installed'));
    });
  }

  /**
   * Show update prompt to user
   */
  private showUpdatePrompt(): void {
    // Dispatch custom event for UI components to handle
    window.dispatchEvent(new CustomEvent('pwa-update-available', {
      detail: {
        updateAvailable: true,
        skipWaiting: () => this.skipWaiting(),
        dismiss: () => this.dismissUpdate()
      }
    }));
  }

  /**
   * Show install prompt to user
   */
  private showInstallPrompt(): void {
    if (!this.deferredPrompt) return;
    
    // Dispatch custom event for UI components to handle
    window.dispatchEvent(new CustomEvent('pwa-install-available', {
      detail: {
        installAvailable: true,
        install: () => this.promptInstall(),
        dismiss: () => this.dismissInstall()
      }
    }));
  }

  /**
   * Skip waiting and activate new service worker
   */
  async skipWaiting(): Promise<void> {
    if (!this.wb) return;
    
    // Tell the waiting service worker to skip waiting
    this.wb.messageSkipWaiting();
    
    // Clear old caches to ensure fresh content
    await this.clearOldCaches();
  }

  /**
   * Prompt user to install the app
   */
  async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.warn('PWA: No install prompt available');
      return false;
    }

    try {
      // Show the install prompt
      await this.deferredPrompt.prompt();
      
      // Wait for user response
      const choiceResult = await this.deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA: User accepted the install prompt');
        this.installPromptShown = true;
        return true;
      } else {
        console.log('PWA: User dismissed the install prompt');
        this.dismissInstall();
        return false;
      }
    } catch (error) {
      console.error('PWA: Error during install prompt:', error);
      return false;
    } finally {
      // Clear the deferred prompt
      this.deferredPrompt = null;
    }
  }

  /**
   * Dismiss install prompt
   */
  dismissInstall(): void {
    this.installPromptShown = true;
    this.deferredPrompt = null;
    window.dispatchEvent(new CustomEvent('pwa-install-dismissed'));
  }

  /**
   * Dismiss update notification
   */
  dismissUpdate(): void {
    window.dispatchEvent(new CustomEvent('pwa-update-dismissed'));
  }

  /**
   * Clear old caches
   */
  private async clearOldCaches(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => !name.includes('workbox-precache'))
          .map(name => caches.delete(name))
      );
      console.log('PWA: Cleared old caches');
    }
  }

  /**
   * Check if app can be installed
   */
  canInstall(): boolean {
    return this.deferredPrompt !== null && !this.isInstalled();
  }

  /**
   * Check if install prompt is available
   */
  hasInstallPrompt(): boolean {
    return this.deferredPrompt !== null;
  }

  /**
   * Get installation status
   */
  isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.matchMedia('(display-mode: fullscreen)').matches ||
           (window.navigator as any).standalone === true;
  }

  /**
   * Get online status
   */
  isOnline(): boolean {
    return navigator.onLine;
  }

  /**
   * Get service worker registration for notifications
   */
  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }
}

// Create singleton instance
export const pwaManager = new PWAManager();
