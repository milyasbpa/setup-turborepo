# Progressive Web App (PWA) Setup Documentation

This document explains the comprehensive PWA implementation in the frontend project, including service worker management, offline support, and push notifications.

## 📦 Installation & Dependencies

The following packages are installed:
- `vite-plugin-pwa` - Vite plugin for PWA generation with Workbox
- `workbox-window` - Client-side library for service worker management

## 🏗️ Architecture Overview

### Core PWA Components

```
src/core/pwa/
├── PWAManager.ts         # Core PWA service worker management with install prompts
├── NotificationManager.ts # Push notifications & local notifications
├── SplashScreen.tsx      # PWA splash screen component with Tailwind CSS
├── hooks.ts              # React hooks for PWA functionality
├── components.tsx        # UI components for PWA features (enhanced with Tailwind)
└── index.ts              # Centralized exports
```

## 🔧 Configuration

### Vite PWA Configuration (`vite.config.ts`)

```typescript
VitePWA({
  registerType: 'prompt',          // Require user interaction for updates
  includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    cleanupOutdatedCaches: true,   // Auto-cleanup old caches
    skipWaiting: false,            // Don't auto-update (user prompt)
  },
  devOptions: {
    enabled: true,                 // Enable PWA in development
    type: 'module',
  },
  manifest: {
    name: 'Turborepo Frontend App',
    short_name: 'TurboApp',
    description: 'A modern React application with PWA capabilities',
    theme_color: '#61dafb',
    background_color: '#282c34',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    // ... additional manifest properties
  }
})
```

## 🚀 Key Features

### ✅ Service Worker Management
- **Auto-generated Service Worker**: Using Workbox for robust caching strategies
- **Manual Update Control**: Users must approve updates (no forced refresh)
- **Cache Cleanup**: Automatically removes outdated caches on update
- **Development Support**: PWA works in development mode

### ✅ Android Install Prompts
- **Beautiful Install UI**: Custom-designed install prompt using Tailwind CSS
- **Feature Highlights**: Shows offline capability, fast loading, and push notifications
- **Auto-trigger**: Appears when PWA criteria are met on Android devices
- **User Choice**: Respects user decision (install or dismiss permanently)

### ✅ Splash Screen System
- **PWA Detection**: Only shows when app is installed as PWA
- **Smooth Animations**: Fade in/out transitions using Tailwind CSS
- **Customizable**: App name, tagline, logo easily configurable
- **Loading Indicator**: Progress bar animation during startup

### ✅ Update Management
- **Update Prompt UI**: Non-intrusive notification when updates are available
- **Skip Waiting**: Clean update process that clears old caches
- **User Choice**: Users can choose when to update or dismiss notifications

### ✅ Installation Support
- **Install Prompt**: Detects when app can be installed on Android
- **Installation UI**: Custom install prompt with loading states and features list
- **Install Detection**: Knows when app is running as installed PWA

### ✅ Network Awareness
- **Online/Offline Detection**: Real-time network status monitoring
- **Network Status UI**: Visual indicator with Tailwind CSS styling
- **Offline Notifications**: Alerts users when going offline/online

### ✅ Notification System
- **Local Notifications**: System notifications for app events
- **Push Notifications**: Server-sent push notification support (skeleton)
- **Permission Management**: Proper permission request flow
- **Notification Actions**: Support for notification action buttons

### ✅ Tailwind CSS Integration
- **Modern Styling**: All PWA components styled with Tailwind CSS v3
- **Custom Animations**: Fade, slide, and pulse animations for PWA components
- **Responsive Design**: Mobile-first responsive PWA interface
- **PostCSS Configuration**: Properly configured with @tailwindcss/postcss plugin

## 🎯 Usage Examples

### Basic PWA Hook Usage

```typescript
import { usePWA } from '@/core/pwa';

function MyComponent() {
  const {
    isInstalled,
    canInstall,
    isOnline,
    updateAvailable,
    installing,
    installApp,
    updateApp,
    dismissUpdate
  } = usePWA();

  // Component logic using PWA state
}
```

### Splash Screen Hook Usage

```typescript
import { useSplashScreen, SplashScreen } from '@/core/pwa';

function App() {
  const { isVisible, isComplete, onComplete } = useSplashScreen({
    showOnPWA: true,    // Only show when running as PWA
    duration: 2500      // Duration in milliseconds
  });

  if (isVisible) {
    return (
      <SplashScreen 
        isVisible={isVisible}
        appName="TurboApp"
        appTagline="Modern PWA Experience"
        logoText="TA"
        onComplete={onComplete}
      />
    );
  }

  return <MainApp />;
}
```

### Install Prompt Usage

```typescript
import { InstallPrompt } from '@/core/pwa';

function Layout() {
  return (
    <div>
      <Header />
      <InstallPrompt /> {/* Shows automatically when installable */}
      <MainContent />
    </div>
  );
}
```

### Notification Hook Usage

```typescript
import { useNotifications } from '@/core/pwa';

function NotificationComponent() {
  const {
    permission,
    requestPermission,
    showNotification,
    subscribeToPush
  } = useNotifications();

  const handleNotify = async () => {
    if (permission !== 'granted') {
      await requestPermission();
    }
    
    await showNotification({
      title: 'Hello!',
      body: 'This is a test notification',
      icon: '/pwa-192x192.png'
    });
  };
}
```

### Network Status Usage

```typescript
import { useNetworkStatus } from '@/core/pwa';

function NetworkComponent() {
  const { isOnline, wasOffline } = useNetworkStatus();
  
  return (
    <div>
      Status: {isOnline ? 'Online' : 'Offline'}
      {wasOffline && isOnline && <span>Connection restored!</span>}
    </div>
  );
}
```

## 🔄 Service Worker Update Strategy

### No Auto-Update Policy
```typescript
workbox: {
  skipWaiting: false,  // Requires user interaction
}
```

This ensures:
- ✅ Users are not interrupted by sudden refreshes
- ✅ Users control when to update
- ✅ Critical user data/state is preserved
- ✅ Better user experience with conscious updates

### Update Flow
1. **New SW Available**: Service worker detects update
2. **User Notification**: Update prompt appears
3. **User Choice**: User can update now or later
4. **Clean Update**: Old caches cleared, new SW activated
5. **Page Refresh**: App reloads with new version

## 📱 PWA Manifest Features

### App Identity
- **Name**: "Turborepo Frontend App"
- **Short Name**: "TurboApp"
- **Theme Color**: `#61dafb` (React blue)
- **Background Color**: `#282c34` (Dark theme)

### Display & Behavior
- **Display Mode**: `standalone` (looks like native app)
- **Orientation**: `portrait-primary`
- **Scope**: `/` (entire app)
- **Start URL**: `/` (home page)

### Icons & Screenshots
- **App Icons**: Multiple sizes (64x64, 192x192, 512x512)
- **Maskable Icon**: Adaptive icon for different platforms
- **Screenshots**: Wide and narrow format for app stores

## 🔔 Notification System Architecture

### Local Notifications
```typescript
// Show update notification
await notificationManager.showUpdateNotification();

// Show offline notification
await notificationManager.showOfflineNotification();

// Custom notification
await notificationManager.showNotification({
  title: 'Custom Title',
  body: 'Custom message',
  icon: '/icon.png',
  actions: [
    { action: 'view', title: 'View' },
    { action: 'dismiss', title: 'Dismiss' }
  ]
});
```

### Push Notifications (Skeleton)
```typescript
// Subscribe to push notifications
const subscription = await notificationManager.subscribeToPush(vapidKey);

// Send subscription to your server
await fetch('/api/subscribe', {
  method: 'POST',
  body: JSON.stringify(subscription)
});
```

## 🛠️ Integration Points

### App.tsx Integration
```typescript
import { useSplashScreen, SplashScreen } from '@/core/pwa';

function App() {
  const { isVisible, isComplete, onComplete } = useSplashScreen({
    showOnPWA: true,
    duration: 2500
  });

  if (isVisible) {
    return (
      <SplashScreen 
        isVisible={isVisible}
        appName="TurboApp"
        appTagline="Modern PWA Experience"
        logoText="TA"
        onComplete={onComplete}
      />
    );
  }

  return (
    <QueryProvider>
      <AppRouter />
      <UpdatePrompt />      {/* Update notifications */}
      <InstallPrompt />     {/* Install prompts with features list */}
    </QueryProvider>
  );
}
```

### Layout Integration
```typescript
// MainLayout.tsx includes NetworkStatus with Tailwind CSS styling
<div className="header-status">
  <NetworkStatus />
</div>
```

### Tailwind CSS Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'pulse-slow': 'pulse 2s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
```

### PostCSS Configuration
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}
  }
};
```

## 🚀 Development & Testing

### Development Mode
- PWA functionality works in `npm run dev`
- Service worker simulated for testing
- Notifications work (with permission)
- Install prompts available

### Production Testing
```bash
# Build the app
npm run build

# Serve the built app
npx serve dist

# Test PWA features:
# - Service worker registration
# - Offline functionality
# - Install prompts
# - Update notifications
```

### PWA Testing Checklist
- [ ] Service worker registers successfully
- [ ] App works offline (cached resources)
- [ ] Update notifications appear
- [ ] Install prompt shows on Android Chrome/Edge when criteria met
- [ ] Install prompt shows features list (offline work, fast loading, notifications)
- [ ] Splash screen appears only when app is installed as PWA
- [ ] Splash screen shows app name, tagline, and loading animation
- [ ] Network status updates correctly with visual indicators
- [ ] Notifications work with permission
- [ ] Tailwind CSS styles render correctly for all PWA components

## 🎯 Performance Optimizations

### Caching Strategy
- **Precaching**: Critical app shell and assets
- **Runtime Caching**: API responses and dynamic content
- **Cache First**: For static assets (CSS, JS, images)
- **Network First**: For dynamic API data

### Bundle Optimization
- **Code Splitting**: Lazy-loaded PWA components
- **Tree Shaking**: Only used Workbox features included
- **Compression**: Gzipped assets in production

## 🔧 Customization

### Adding Custom Notifications
```typescript
// Extend NotificationManager
class CustomNotificationManager extends NotificationManager {
  async showCustomNotification(type: string, data: any) {
    await this.showNotification({
      title: `Custom ${type}`,
      body: JSON.stringify(data),
      tag: `custom-${type}`,
      // ... custom options
    });
  }
}
```

### Custom PWA Events
```typescript
// Listen for custom PWA events
window.addEventListener('pwa-custom-event', (event) => {
  console.log('Custom PWA event:', event.detail);
});

// Dispatch custom events
window.dispatchEvent(new CustomEvent('pwa-custom-event', {
  detail: { action: 'custom-action' }
}));
```

## 📊 Analytics & Monitoring

### Service Worker Events
```typescript
// Track SW lifecycle events
navigator.serviceWorker.addEventListener('message', (event) => {
  console.log('SW Event:', event.data);
  // Send to analytics
});
```

### PWA Metrics
- Install rate (beforeinstallprompt → appinstalled)
- Update acceptance rate
- Offline usage patterns
- Notification engagement

## 🚨 Error Handling

### Service Worker Errors
```typescript
// Handle registration errors
try {
  await pwaManager.init();
} catch (error) {
  console.error('PWA initialization failed:', error);
  // Fallback to regular web app
}
```

### Notification Errors
```typescript
// Handle permission denied
if (permission === 'denied') {
  // Show alternative UI or guidance
  showNotificationBlockedMessage();
}
```

## 🔮 Future Enhancements

### Planned Features
- [ ] **Background Sync**: Sync data when connection restored
- [ ] **Periodic Background Sync**: Regular data updates
- [ ] **Web Share API**: Native sharing capabilities
- [ ] **File System Access**: Local file operations
- [ ] **Advanced Caching**: Custom caching strategies per route

### Server Integration
- [ ] **Push Server**: Node.js push notification server
- [ ] **VAPID Keys**: Proper push subscription management
- [ ] **Analytics**: PWA usage tracking
- [ ] **A/B Testing**: PWA feature experimentation

This PWA implementation provides a solid foundation for a modern, app-like web experience with proper update management, offline support, and notification capabilities. 🚀
