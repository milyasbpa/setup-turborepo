/**
 * Environment Configuration
 * Centralized access to environment variables with type safety and defaults
 */

export interface EnvironmentConfig {
  // Application Configuration
  baseUrl: string;
  appName: string;
  appShortName: string;
  appDescription: string;
  siteName: string;

  // API Configuration
  apiUrl: string;
  apiBasePath: string;
  apiTimeout: number;
  openApiUrl: string;

  // Development & Debug
  enableReactQueryDevtools: boolean;
  debugMode: boolean;
  i18nDebug: boolean;
  pwaDevEnabled: boolean;
  isDevelopment: boolean;
  isProduction: boolean;

  // PWA Configuration
  pwaThemeColor: string;
  pwaBackgroundColor: string;
  vapidPublicKey: string;
  swRegisterType: 'prompt' | 'autoUpdate' | 'disabled';

  // SEO & Social Media
  seoKeywords: string;
  ogImage: string;
  twitterSite: string;
  twitterCreator: string;

  // Analytics & Tracking
  gaMeasurementId: string;
  gtmContainerId: string;
  fbPixelId: string;
  hotjarId: string;
  mixpanelToken: string;
  analyticsDevEnabled: boolean;

  // Feature Flags
  features: {
    recommendations: boolean;
    notifications: boolean;
    offlineMode: boolean;
    analytics: boolean;
  };

  // Third-party Integrations
  sentryDsn: string;
  posthogKey: string;
  posthogHost: string;

  // Internationalization
  defaultLanguage: string;
  supportedLanguages: string[];

  // Performance & Optimization
  enableCodeSplitting: boolean;
  chunkSizeWarningLimit: number;
  enableBundleAnalyzer: boolean;

  // Security
  cspNonce: string;
  enableSecureHeaders: boolean;
}

/**
 * Parse environment variable as boolean
 */
function parseBoolean(value: string | undefined, defaultValue: boolean = false): boolean {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
}

/**
 * Parse environment variable as number
 */
function parseNumber(value: string | undefined, defaultValue: number = 0): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Parse comma-separated string to array
 */
function parseArray(value: string | undefined, defaultValue: string[] = []): string[] {
  if (!value) return defaultValue;
  return value.split(',').map(item => item.trim()).filter(Boolean);
}

/**
 * Get environment configuration with proper types and defaults
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  return {
    // Application Configuration
    baseUrl: import.meta.env.VITE_BASE_URL || 'http://localhost:5173',
    appName: import.meta.env.VITE_APP_NAME || 'MathLearn - Interactive Math Learning Platform',
    appShortName: import.meta.env.VITE_APP_SHORT_NAME || 'MathLearn',
    appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'A modern React application with PWA capabilities',
    siteName: import.meta.env.VITE_SITE_NAME || 'MathLearn',

    // API Configuration
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3002',
    apiBasePath: import.meta.env.VITE_API_BASE_PATH || '/api',
    apiTimeout: parseNumber(import.meta.env.VITE_API_TIMEOUT, 10000),
    openApiUrl: import.meta.env.VITE_OPENAPI_URL || 'http://localhost:3002/api/docs.json',

    // Development & Debug
    enableReactQueryDevtools: parseBoolean(import.meta.env.VITE_ENABLE_REACT_QUERY_DEVTOOLS, true),
    debugMode: parseBoolean(import.meta.env.VITE_DEBUG_MODE, import.meta.env.DEV),
    i18nDebug: parseBoolean(import.meta.env.VITE_I18N_DEBUG, import.meta.env.DEV),
    pwaDevEnabled: parseBoolean(import.meta.env.VITE_PWA_DEV_ENABLED, true),
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,

    // PWA Configuration
    pwaThemeColor: import.meta.env.VITE_PWA_THEME_COLOR || '#61dafb',
    pwaBackgroundColor: import.meta.env.VITE_PWA_BACKGROUND_COLOR || '#282c34',
    vapidPublicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY || '',
    swRegisterType: (import.meta.env.VITE_SW_REGISTER_TYPE as 'prompt' | 'autoUpdate' | 'disabled') || 'prompt',

    // SEO & Social Media
    seoKeywords: import.meta.env.VITE_SEO_KEYWORDS || 'React,TypeScript,Vite,Math Learning,Education,PWA,i18n',
    ogImage: import.meta.env.VITE_OG_IMAGE || '/og-image.png',
    twitterSite: import.meta.env.VITE_TWITTER_SITE || '@mathlearn_app',
    twitterCreator: import.meta.env.VITE_TWITTER_CREATOR || '@mathlearn_app',

  // Analytics Configuration
  gaMeasurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
  gtmContainerId: import.meta.env.VITE_GTM_CONTAINER_ID || '',
  fbPixelId: import.meta.env.VITE_FB_PIXEL_ID || '',
  hotjarId: import.meta.env.VITE_HOTJAR_ID || '',
  mixpanelToken: import.meta.env.VITE_MIXPANEL_TOKEN || '',
  analyticsDevEnabled: parseBoolean(import.meta.env.VITE_ANALYTICS_DEV_ENABLED, import.meta.env.DEV),

  // Feature Flags
    features: {
      recommendations: parseBoolean(import.meta.env.VITE_FEATURE_RECOMMENDATIONS, true),
      notifications: parseBoolean(import.meta.env.VITE_FEATURE_NOTIFICATIONS, true),
      offlineMode: parseBoolean(import.meta.env.VITE_FEATURE_OFFLINE_MODE, true),
      analytics: parseBoolean(import.meta.env.VITE_FEATURE_ANALYTICS, true),
    },

    // Third-party Integrations
    sentryDsn: import.meta.env.VITE_SENTRY_DSN || '',
    posthogKey: import.meta.env.VITE_POSTHOG_KEY || '',
    posthogHost: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',

    // Internationalization
    defaultLanguage: import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',
    supportedLanguages: parseArray(import.meta.env.VITE_SUPPORTED_LANGUAGES, ['en', 'id']),

    // Performance & Optimization
    enableCodeSplitting: parseBoolean(import.meta.env.VITE_ENABLE_CODE_SPLITTING, true),
    chunkSizeWarningLimit: parseNumber(import.meta.env.VITE_CHUNK_SIZE_WARNING_LIMIT, 500),
    enableBundleAnalyzer: parseBoolean(import.meta.env.VITE_ENABLE_BUNDLE_ANALYZER, false),

    // Security
    cspNonce: import.meta.env.VITE_CSP_NONCE || '',
    enableSecureHeaders: parseBoolean(import.meta.env.VITE_ENABLE_SECURE_HEADERS, true),
  };
}

/**
 * Environment configuration singleton
 */
export const env = getEnvironmentConfig();

/**
 * Type-safe environment variable access with IntelliSense
 */
export const Environment = {
  ...env,

  // Computed properties
  get isLocalhost(): boolean {
    return this.baseUrl.includes('localhost') || this.baseUrl.includes('127.0.0.1');
  },

  get isHttps(): boolean {
    return this.baseUrl.startsWith('https://');
  },

  get canUseNotifications(): boolean {
    return this.features.notifications && 'Notification' in window;
  },

  get canUsePwa(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  },

  get shouldShowAnalytics(): boolean {
    return this.features.analytics && (this.isProduction || this.analyticsDevEnabled);
  },

  // Utility methods
  getApiUrl(path: string = ''): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.apiUrl}${this.apiBasePath}${cleanPath}`;
  },

  getFullUrl(path: string = ''): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseUrl}${cleanPath}`;
  },

  isFeatureEnabled(feature: keyof typeof env.features): boolean {
    return this.features[feature];
  },
} as const;

/**
 * Validate required environment variables
 */
export function validateEnvironment(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for required production variables
  if (env.isProduction) {
    if (!env.baseUrl || env.baseUrl.includes('localhost')) {
      errors.push('VITE_BASE_URL must be set to a production URL');
    }

    if (!env.apiUrl || env.apiUrl.includes('localhost')) {
      errors.push('VITE_API_URL must be set to a production API URL');
    }

    if (env.features.analytics && !env.gaMeasurementId) {
      errors.push('VITE_GA_MEASUREMENT_ID is required when analytics is enabled');
    }

    if (env.features.notifications && !env.vapidPublicKey) {
      errors.push('VITE_VAPID_PUBLIC_KEY is required when notifications are enabled');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Log environment configuration (development only)
 */
export function logEnvironmentInfo(): void {
  if (!env.isDevelopment) return;

  console.group('🌍 Environment Configuration');
  console.log('Mode:', env.isProduction ? 'Production' : 'Development');
  console.log('Base URL:', env.baseUrl);
  console.log('API URL:', env.apiUrl);
  console.log('Features:', env.features);
  console.log('Debug Mode:', env.debugMode);
  console.groupEnd();

  // Validate environment
  const validation = validateEnvironment();
  if (!validation.valid) {
    console.group('⚠️ Environment Validation Errors');
    validation.errors.forEach(error => console.warn(error));
    console.groupEnd();
  }
}

export default Environment;
