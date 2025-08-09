# Environment Variables Documentation

This document provides a comprehensive overview of all environment variables used in the frontend application, their purposes, and configuration examples.

## 📋 Table of Contents

- [Application Configuration](#application-configuration)
- [API Configuration](#api-configuration)
- [Development & Debug](#development--debug)
- [PWA Configuration](#pwa-configuration)
- [SEO & Social Media](#seo--social-media)
- [Analytics & Tracking](#analytics--tracking)
- [Feature Flags](#feature-flags)
- [Third-party Integrations](#third-party-integrations)
- [Internationalization](#internationalization)
- [Performance & Optimization](#performance--optimization)
- [Security](#security)

## 🏗️ Application Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_BASE_URL` | `string` | `http://localhost:5173` | Base URL for the application |
| `VITE_APP_NAME` | `string` | `Turborepo Math Learning App` | Full application name |
| `VITE_APP_SHORT_NAME` | `string` | `TurboApp` | Short application name for PWA |
| `VITE_APP_DESCRIPTION` | `string` | `A modern React application with PWA capabilities` | Application description |
| `VITE_SITE_NAME` | `string` | `TurboApp` | Site name for SEO and branding |

### Example Configuration
```bash
VITE_BASE_URL=https://myapp.com
VITE_APP_NAME=My Amazing App
VITE_APP_SHORT_NAME=MyApp
VITE_APP_DESCRIPTION=An innovative web application built with React
VITE_SITE_NAME=My Amazing App
```

## 🔌 API Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_API_URL` | `string` | `http://localhost:3002` | Backend API base URL |
| `VITE_API_BASE_PATH` | `string` | `/api` | API base path prefix |
| `VITE_API_TIMEOUT` | `number` | `10000` | API request timeout in milliseconds |
| `VITE_OPENAPI_URL` | `string` | `http://localhost:3002/api/docs.json` | OpenAPI specification URL |

### Example Configuration
```bash
VITE_API_URL=https://api.myapp.com
VITE_API_BASE_PATH=/v1
VITE_API_TIMEOUT=15000
VITE_OPENAPI_URL=https://api.myapp.com/v1/docs.json
```

## 🛠️ Development & Debug

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_ENABLE_REACT_QUERY_DEVTOOLS` | `boolean` | `true` | Enable React Query DevTools |
| `VITE_DEBUG_MODE` | `boolean` | `DEV` | Enable debug mode and console logging |
| `VITE_I18N_DEBUG` | `boolean` | `DEV` | Enable i18n debugging |
| `VITE_PWA_DEV_ENABLED` | `boolean` | `true` | Enable PWA features in development |

### Example Configuration
```bash
# Production
VITE_ENABLE_REACT_QUERY_DEVTOOLS=false
VITE_DEBUG_MODE=false
VITE_I18N_DEBUG=false
VITE_PWA_DEV_ENABLED=false

# Development
VITE_ENABLE_REACT_QUERY_DEVTOOLS=true
VITE_DEBUG_MODE=true
VITE_I18N_DEBUG=true
VITE_PWA_DEV_ENABLED=true
```

## 📱 PWA Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_PWA_THEME_COLOR` | `string` | `#61dafb` | PWA theme color |
| `VITE_PWA_BACKGROUND_COLOR` | `string` | `#282c34` | PWA background color |
| `VITE_VAPID_PUBLIC_KEY` | `string` | `""` | VAPID public key for push notifications |
| `VITE_SW_REGISTER_TYPE` | `enum` | `prompt` | Service worker registration type |

### Example Configuration
```bash
VITE_PWA_THEME_COLOR=#3b82f6
VITE_PWA_BACKGROUND_COLOR=#ffffff
VITE_VAPID_PUBLIC_KEY=BL4zFKv-kKZjzTYPMFe3M2Q...
VITE_SW_REGISTER_TYPE=autoUpdate
```

#### Service Worker Registration Types
- `prompt`: Ask user before updating
- `autoUpdate`: Automatically update service worker
- `disabled`: Disable service worker registration

## 🔍 SEO & Social Media

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_SEO_KEYWORDS` | `string` | `React,TypeScript,Vite,Math Learning,Education,PWA,i18n` | Default SEO keywords |
| `VITE_OG_IMAGE` | `string` | `/og-image.png` | Open Graph image path |
| `VITE_TWITTER_SITE` | `string` | `@turboapp` | Twitter site handle |
| `VITE_TWITTER_CREATOR` | `string` | `@turboapp` | Twitter creator handle |

### Example Configuration
```bash
VITE_SEO_KEYWORDS=education,learning,math,interactive,students,teachers
VITE_OG_IMAGE=/assets/social-preview.png
VITE_TWITTER_SITE=@myappofficial
VITE_TWITTER_CREATOR=@myappcreator
```

## 📊 Analytics & Tracking

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_GA_MEASUREMENT_ID` | `string` | `""` | Google Analytics 4 Measurement ID |
| `VITE_GTM_CONTAINER_ID` | `string` | `""` | Google Tag Manager Container ID |
| `VITE_FB_PIXEL_ID` | `string` | `""` | Facebook Pixel ID |
| `VITE_HOTJAR_ID` | `string` | `""` | Hotjar Site ID |
| `VITE_MIXPANEL_TOKEN` | `string` | `""` | Mixpanel project token |
| `VITE_ANALYTICS_DEV_ENABLED` | `boolean` | `DEV` | Enable analytics in development |

### Example Configuration
```bash
# Production
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GTM_CONTAINER_ID=GTM-XXXXXXX
VITE_FB_PIXEL_ID=123456789012345
VITE_HOTJAR_ID=1234567
VITE_MIXPANEL_TOKEN=your-mixpanel-token
VITE_ANALYTICS_DEV_ENABLED=false

# Development
VITE_ANALYTICS_DEV_ENABLED=true
```

## 🚀 Feature Flags

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_FEATURE_RECOMMENDATIONS` | `boolean` | `true` | Enable recommendation system |
| `VITE_FEATURE_NOTIFICATIONS` | `boolean` | `true` | Enable push notifications |
| `VITE_FEATURE_OFFLINE_MODE` | `boolean` | `true` | Enable offline functionality |
| `VITE_FEATURE_ANALYTICS` | `boolean` | `true` | Enable analytics tracking |

### Example Configuration
```bash
# Full feature set
VITE_FEATURE_RECOMMENDATIONS=true
VITE_FEATURE_NOTIFICATIONS=true
VITE_FEATURE_OFFLINE_MODE=true
VITE_FEATURE_ANALYTICS=true

# Minimal feature set
VITE_FEATURE_RECOMMENDATIONS=false
VITE_FEATURE_NOTIFICATIONS=false
VITE_FEATURE_OFFLINE_MODE=false
VITE_FEATURE_ANALYTICS=false
```

## 🔧 Third-party Integrations

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_SENTRY_DSN` | `string` | `""` | Sentry DSN for error tracking |
| `VITE_POSTHOG_KEY` | `string` | `""` | PostHog project API key |
| `VITE_POSTHOG_HOST` | `string` | `https://app.posthog.com` | PostHog host URL |

### Example Configuration
```bash
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
VITE_POSTHOG_KEY=phc_your-posthog-key
VITE_POSTHOG_HOST=https://app.posthog.com
```

## 🌐 Internationalization

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_DEFAULT_LANGUAGE` | `string` | `en` | Default application language |
| `VITE_SUPPORTED_LANGUAGES` | `string` | `en,id` | Comma-separated supported languages |

### Example Configuration
```bash
VITE_DEFAULT_LANGUAGE=en
VITE_SUPPORTED_LANGUAGES=en,id,fr,es,de
```

## ⚡ Performance & Optimization

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_ENABLE_CODE_SPLITTING` | `boolean` | `true` | Enable code splitting |
| `VITE_CHUNK_SIZE_WARNING_LIMIT` | `number` | `500` | Bundle size warning limit (KB) |
| `VITE_ENABLE_BUNDLE_ANALYZER` | `boolean` | `false` | Enable bundle analyzer |

### Example Configuration
```bash
VITE_ENABLE_CODE_SPLITTING=true
VITE_CHUNK_SIZE_WARNING_LIMIT=1000
VITE_ENABLE_BUNDLE_ANALYZER=false
```

## 🔒 Security

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_CSP_NONCE` | `string` | `""` | Content Security Policy nonce |
| `VITE_ENABLE_SECURE_HEADERS` | `boolean` | `false` | Enable security headers |

### Example Configuration
```bash
VITE_CSP_NONCE=random-nonce-value
VITE_ENABLE_SECURE_HEADERS=true
```

## 🔄 Environment-Specific Configurations

### Development (.env.local)
```bash
# Application
VITE_BASE_URL=http://localhost:5173
VITE_APP_NAME=TurboApp Development

# API
VITE_API_URL=http://localhost:3002
VITE_API_TIMEOUT=30000

# Debug
VITE_DEBUG_MODE=true
VITE_I18N_DEBUG=true
VITE_ENABLE_REACT_QUERY_DEVTOOLS=true

# PWA
VITE_PWA_DEV_ENABLED=true
VITE_SW_REGISTER_TYPE=prompt

# Analytics (disabled in development)
VITE_ANALYTICS_DEV_ENABLED=false
```

### Staging (.env.staging)
```bash
# Application
VITE_BASE_URL=https://staging.myapp.com
VITE_APP_NAME=TurboApp Staging

# API
VITE_API_URL=https://api-staging.myapp.com
VITE_API_TIMEOUT=15000

# Debug (limited in staging)
VITE_DEBUG_MODE=false
VITE_I18N_DEBUG=false
VITE_ENABLE_REACT_QUERY_DEVTOOLS=false

# PWA
VITE_PWA_DEV_ENABLED=false
VITE_SW_REGISTER_TYPE=autoUpdate

# Analytics (test credentials)
VITE_GA_MEASUREMENT_ID=G-STAGING-ID
VITE_ANALYTICS_DEV_ENABLED=true
```

### Production (.env.production)
```bash
# Application
VITE_BASE_URL=https://myapp.com
VITE_APP_NAME=TurboApp

# API
VITE_API_URL=https://api.myapp.com
VITE_API_TIMEOUT=10000

# Debug (disabled in production)
VITE_DEBUG_MODE=false
VITE_I18N_DEBUG=false
VITE_ENABLE_REACT_QUERY_DEVTOOLS=false

# PWA
VITE_PWA_DEV_ENABLED=false
VITE_SW_REGISTER_TYPE=autoUpdate

# Analytics (production credentials)
VITE_GA_MEASUREMENT_ID=G-PRODUCTION-ID
VITE_GTM_CONTAINER_ID=GTM-PROD123
VITE_FB_PIXEL_ID=123456789012345
VITE_ANALYTICS_DEV_ENABLED=false

# Security
VITE_ENABLE_SECURE_HEADERS=true
```

## 🏗️ Usage in Code

The environment variables are accessed through the centralized `Environment` utility:

```typescript
import { Environment } from '@/core/config/environment';

// Application configuration
const appName = Environment.appName;
const baseUrl = Environment.baseUrl;

// API configuration
const apiUrl = Environment.getApiUrl('/users');

// Feature flags
if (Environment.features.analytics) {
  // Initialize analytics
}

// Conditional features
if (Environment.shouldShowAnalytics) {
  // Show analytics UI
}

// Computed properties
const fullUrl = Environment.getFullUrl('/dashboard');
```

## 🛡️ Environment Validation

The environment configuration includes built-in validation and type safety:

- **Type Safety**: All variables are properly typed
- **Default Values**: Sensible defaults for all configurations
- **Computed Properties**: Dynamic values based on environment state
- **Helper Functions**: Utilities for parsing and validation

## 📝 Best Practices

1. **Use .env.example**: Always update the example file when adding new variables
2. **Document Changes**: Update this documentation when adding new environment variables
3. **Secure Secrets**: Never commit actual API keys or secrets to version control
4. **Environment Specific**: Use different values for development, staging, and production
5. **Validation**: Use the centralized Environment utility instead of accessing `import.meta.env` directly
6. **Naming Convention**: Use the `VITE_` prefix for all client-side environment variables

## 🚨 Security Considerations

- **Client-Side Exposure**: All `VITE_` variables are exposed to the client
- **Sensitive Data**: Never put sensitive information in client-side environment variables
- **API Keys**: Use public API keys only, keep private keys on the server
- **Environment Files**: Add `.env.local` and `.env.production` to `.gitignore`

## 📚 Related Documentation

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [PWA Configuration](./docs/pwa.md)
- [Analytics Setup](./docs/analytics.md)
- [SEO Configuration](./docs/seo.md)
