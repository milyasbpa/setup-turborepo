/**
 * Notification Manager for handling push notifications and local notifications
 * Provides abstraction over browser notification APIs
 */

export interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: { action: string; title: string }[];
  requireInteraction?: boolean;
  silent?: boolean;
}

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export class NotificationManager {
  private registration: ServiceWorkerRegistration | null = null;
  private permission: string = 'default';

  /**
   * Initialize notification manager
   */
  constructor(registration: ServiceWorkerRegistration | null = null) {
    this.registration = registration;
    this.permission = this.getPermission();
  }

  /**
   * Set service worker registration
   */
  setRegistration(registration: ServiceWorkerRegistration | null): void {
    this.registration = registration;
  }

  /**
   * Check if notifications are supported
   */
  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  /**
   * Get current notification permission
   */
  getPermission(): string {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<string> {
    if (!this.isSupported()) {
      console.warn('Notifications are not supported in this browser');
      return 'denied';
    }

    try {
      this.permission = await Notification.requestPermission();
      console.log('Notification permission:', this.permission);
      return this.permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  /**
   * Show local notification
   */
  async showNotification(options: NotificationOptions): Promise<void> {
    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      if (this.registration) {
        // Use service worker registration for better reliability
        await this.registration.showNotification(options.title, {
          body: options.body,
          icon: options.icon || '/pwa-192x192.png',
          badge: options.badge || '/pwa-64x64.png',
          tag: options.tag,
          data: options.data,
          requireInteraction: options.requireInteraction || false,
          silent: options.silent || false,
        });
      } else {
        // Fallback to basic notification
        new Notification(options.title, {
          body: options.body,
          icon: options.icon || '/pwa-192x192.png',
          tag: options.tag,
          data: options.data,
          requireInteraction: options.requireInteraction || false,
          silent: options.silent || false,
        });
      }

      console.log('Notification shown:', options.title);
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  /**
   * Check if push messaging is supported
   */
  isPushSupported(): boolean {
    return 'PushManager' in window && this.registration !== null;
  }

  /**
   * Subscribe to push notifications
   */
  async subscribeToPush(vapidPublicKey: string): Promise<PushSubscriptionData | null> {
    if (!this.isPushSupported()) {
      console.warn('Push messaging is not supported');
      return null;
    }

    if (!this.registration) {
      console.error('Service worker registration not available');
      return null;
    }

    try {
      // Check for existing subscription
      let subscription = await this.registration.pushManager.getSubscription();
      
      if (!subscription) {
        // Create new subscription
        subscription = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey).buffer as ArrayBuffer
        });
      }

      // Convert subscription to sendable format
      const subscriptionData: PushSubscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: this.arrayBufferToBase64(subscription.getKey('auth')!)
        }
      };

      console.log('Push subscription created:', subscriptionData);
      return subscriptionData;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return null;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribeFromPush(): Promise<boolean> {
    if (!this.isPushSupported() || !this.registration) {
      return false;
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        console.log('Unsubscribed from push notifications');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return false;
    }
  }

  /**
   * Get current push subscription
   */
  async getCurrentSubscription(): Promise<PushSubscriptionData | null> {
    if (!this.isPushSupported() || !this.registration) {
      return null;
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription();
      if (!subscription) return null;

      return {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: this.arrayBufferToBase64(subscription.getKey('auth')!)
        }
      };
    } catch (error) {
      console.error('Error getting current subscription:', error);
      return null;
    }
  }

  /**
   * Utility: Convert VAPID key to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * Utility: Convert ArrayBuffer to base64
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    const binary = Array.from(bytes).map(byte => String.fromCharCode(byte)).join('');
    return window.btoa(binary);
  }

  /**
   * Show predefined notification types
   */
  async showUpdateNotification(): Promise<void> {
    await this.showNotification({
      title: 'App Updated!',
      body: 'A new version of the app is available. Tap to refresh.',
      icon: '/pwa-192x192.png',
      tag: 'app-update',
      requireInteraction: true,
      actions: [
        {
          action: 'refresh',
          title: 'Refresh Now'
        },
        {
          action: 'dismiss',
          title: 'Later'
        }
      ]
    });
  }

  async showOfflineNotification(): Promise<void> {
    await this.showNotification({
      title: 'You\'re Offline',
      body: 'Some features may be limited while offline.',
      icon: '/pwa-192x192.png',
      tag: 'offline-status',
      silent: true
    });
  }

  async showOnlineNotification(): Promise<void> {
    await this.showNotification({
      title: 'Back Online!',
      body: 'Your connection has been restored.',
      icon: '/pwa-192x192.png',
      tag: 'online-status',
      silent: true
    });
  }
}

// Create singleton instance
export const notificationManager = new NotificationManager();
