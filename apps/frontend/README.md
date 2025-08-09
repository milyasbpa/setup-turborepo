# 🌐 MathLearn Frontend Application

A modern React TypeScript frontend application built with Vite, featuring Progressive Web App capabilities, internationalization, and adaptive learning interfaces for the MathLearn platform.

## 📋 Table of Contents

- [🚀 Quick Start](#-quick-start)
- [🏗️ Architecture](#️-architecture)
- [✨ Features](#-features)
- [⚙️ Environment Configuration](#️-environment-configuration)
- [📱 Progressive Web App (PWA)](#-progressive-web-app-pwa)
- [🔄 React Query Setup](#-react-query-setup)
- [🌐 Internationalization (i18n)](#-internationalization-i18n)
- [🎨 Styling & UI](#-styling--ui)
- [📊 SEO & Analytics](#-seo--analytics)
- [🛠️ Development](#️-development)
- [🚀 Deployment](#-deployment)
- [🧪 Testing](#-testing)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 8+

### Installation
```bash
# Navigate to frontend directory
cd apps/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Access the application
# 🌐 Frontend App: http://localhost:5173
# 🌍 Indonesian Version: http://localhost:5173/id
```

### Available Scripts
```bash
npm run dev        # Development with hot reload
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # ESLint
npm run type-check # TypeScript validation
```

## 🏗️ Architecture

### Project Structure
```
apps/frontend/
├── src/
│   ├── core/                    # Core functionality & shared utilities
│   │   ├── api/                 # API client and configuration
│   │   │   ├── client.ts        # Axios client with interceptors
│   │   │   ├── endpoints.ts     # API endpoint definitions
│   │   │   └── types.ts         # API response types
│   │   ├── environment/         # Environment configuration
│   │   │   └── environment.ts   # Centralized env var management
│   │   ├── i18n/                # Internationalization system
│   │   │   ├── components/      # LanguageSwitcher, I18nRouteWrapper
│   │   │   ├── locales/         # Translation files (en/, id/)
│   │   │   ├── config.ts        # i18n configuration
│   │   │   ├── hooks.ts         # Translation hooks
│   │   │   └── index.ts         # i18n exports
│   │   ├── layout/              # Layout components
│   │   │   ├── Header.tsx       # Main header with navigation
│   │   │   ├── Footer.tsx       # Footer component
│   │   │   └── Layout.tsx       # Main layout wrapper
│   │   ├── pwa/                 # PWA functionality
│   │   │   ├── PWAManager.ts    # Service worker management
│   │   │   ├── NotificationManager.ts # Push notifications
│   │   │   ├── SplashScreen.tsx # PWA splash screen
│   │   │   ├── hooks.ts         # PWA React hooks
│   │   │   └── components.tsx   # PWA UI components
│   │   ├── query/               # React Query setup
│   │   │   ├── queryClient.ts   # Query client configuration
│   │   │   ├── QueryProvider.tsx # Query provider wrapper
│   │   │   ├── queryKeys.ts     # Centralized query keys
│   │   │   └── queryUtils.ts    # Query utility hooks
│   │   ├── router/              # Routing configuration
│   │   │   ├── AppRouter.tsx    # Main router component
│   │   │   └── routes.ts        # Route definitions
│   │   └── seo/                 # SEO & meta management
│   │       ├── components/      # SEO components
│   │       ├── hooks.ts         # SEO hooks
│   │       └── utils.ts         # SEO utilities
│   ├── features/                # Feature-specific components
│   │   ├── lessons/             # Math lessons interface
│   │   ├── profile/             # User profile management
│   │   ├── analytics/           # Learning analytics dashboard
│   │   └── auth/                # Authentication flows
│   ├── types/                   # TypeScript type definitions
│   │   ├── api.types.ts         # API-related types
│   │   ├── common.types.ts      # Common shared types
│   │   └── json.d.ts            # JSON module declarations
│   ├── App.tsx                  # Main React component
│   ├── main.tsx                 # React entry point
│   └── styles/                  # Global styles
│       ├── globals.css          # Global CSS with Tailwind
│       └── components.css       # Component-specific styles
├── public/                      # Static assets
│   ├── favicon.svg              # App favicon
│   ├── og-image.svg             # Open Graph image
│   ├── robots.txt               # SEO robots file
│   └── sitemap.xml              # SEO sitemap
├── index.html                   # HTML template
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── package.json                 # Dependencies and scripts
└── .env.example                 # Environment variables template
```

### Core Architectural Patterns

#### **Path Aliases**
Clean import statements using `@/` prefix:
```typescript
import { apiClient } from '@/core/api/client';
import { useTranslation } from '@/core/i18n';
import { LessonCard } from '@/features/lessons/components';
```

#### **Feature-Based Organization**
- `/core` - Shared functionality across the application
- `/features` - Domain-specific components and logic
- Separation of concerns with clear boundaries

#### **Type Safety**
- Strict TypeScript configuration
- API response typing with Zod validation
- Environment variable type safety

## ✨ Features

### 🎯 **Core Features**
- **React 18** with TypeScript for modern UI development
- **Vite** for lightning-fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **Path Aliases** for clean import statements
- **Hot Module Replacement** for instant UI updates

### 📱 **Progressive Web App (PWA)**
- **Offline Support** with service worker caching
- **Install Prompts** for native app experience
- **Push Notifications** for engagement
- **Splash Screen** for native app feel
- **Manual Update Control** with user prompts

### 🔄 **State Management**
- **React Query (TanStack Query)** for server state
- **Local State** with React hooks
- **Optimistic Updates** for better UX
- **Automatic Caching** and invalidation

### 🌐 **Internationalization (i18n)**
- **Multi-language Support** (English, Indonesian)
- **Intelligent Routing** with language prefixes
- **Dynamic Language Switching** without page reload
- **Localized Content** and UI elements

### 🎨 **UI/UX Features**
- **Responsive Design** for all screen sizes
- **Modern CSS** with Grid and Flexbox
- **Loading States** and error boundaries
- **Accessible Components** with ARIA support

### 📊 **SEO & Analytics**
- **Meta Tag Management** with React Helmet
- **Open Graph** and Twitter Card support
- **Structured Data** for rich snippets
- **Analytics Integration** ready

## ⚙️ Environment Configuration

The frontend uses a comprehensive environment variable system managed through a centralized utility.

### 🏗️ **Environment Utility**
**Location**: `src/core/environment/environment.ts`

```typescript
// Type-safe environment access
import { Environment } from '@/core/environment';

// Usage in components
const apiUrl = Environment.API_URL;
const appName = Environment.APP_NAME;
const isDebugMode = Environment.DEBUG_MODE;
```

### 📋 **Configuration Categories**

#### **Application Configuration**
```bash
VITE_BASE_URL=http://localhost:5173
VITE_APP_NAME=MathLearn - Interactive Math Learning Platform
VITE_APP_SHORT_NAME=MathLearn
VITE_APP_DESCRIPTION=Interactive math learning platform
VITE_SITE_NAME=MathLearn
```

#### **API Configuration**
```bash
VITE_API_URL=http://localhost:3002
VITE_API_BASE_PATH=/api
VITE_API_TIMEOUT=10000
VITE_OPENAPI_URL=http://localhost:3002/api/docs.json
```

#### **Development & Debug**
```bash
VITE_DEBUG_MODE=true
VITE_I18N_DEBUG=false
VITE_ENABLE_REACT_QUERY_DEVTOOLS=true
VITE_ENABLE_REDUX_DEVTOOLS=false
VITE_SHOW_PERFORMANCE_METRICS=true
```

#### **PWA Configuration**
```bash
VITE_PWA_ENABLED=true
VITE_SW_UPDATE_PROMPT=true
VITE_ENABLE_PUSH_NOTIFICATIONS=true
VITE_VAPID_PUBLIC_KEY=your-vapid-public-key
```

#### **SEO & Social Media**
```bash
VITE_SEO_TITLE=MathLearn - Interactive Math Learning
VITE_SEO_DESCRIPTION=Learn math interactively with personalized lessons
VITE_SEO_KEYWORDS=React,TypeScript,Vite,Math Learning,Education,PWA,i18n
VITE_OG_IMAGE=/og-image.png
VITE_TWITTER_SITE=@mathlearnapp
VITE_TWITTER_CREATOR=@mathlearnapp
```

#### **Analytics & Tracking**
```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GTM_CONTAINER_ID=GTM-XXXXXXX
VITE_FB_PIXEL_ID=123456789012345
VITE_HOTJAR_ID=1234567
VITE_MIXPANEL_TOKEN=your-mixpanel-token
```

#### **Feature Flags**
```bash
VITE_FEATURE_ADAPTIVE_LEARNING=true
VITE_FEATURE_GAMIFICATION=true
VITE_FEATURE_SOCIAL_LEARNING=false
VITE_FEATURE_AI_TUTORING=true
VITE_FEATURE_VOICE_RECOGNITION=false
```

#### **Security**
```bash
VITE_CSP_NONCE=auto-generated-nonce
VITE_ALLOWED_ORIGINS=http://localhost:3000,https://myapp.com
VITE_API_KEY_HEADER=X-API-Key
VITE_ENABLE_HTTPS_ONLY=true
```

### 🔧 **Environment Setup**

#### **Development**
```bash
# Copy the example file
cp .env.example .env

# Edit with your local settings
VITE_BASE_URL=http://localhost:5173
VITE_API_URL=http://localhost:3002
VITE_DEBUG_MODE=true
```

#### **Production**
```bash
VITE_BASE_URL=https://mathlearn.com
VITE_API_URL=https://api.mathlearn.com
VITE_DEBUG_MODE=false
VITE_ENABLE_ANALYTICS=true
```

## 📱 Progressive Web App (PWA)

### 🏗️ **PWA Architecture**

#### **Core Components**
```
src/core/pwa/
├── PWAManager.ts         # Service worker management
├── NotificationManager.ts # Push notifications
├── SplashScreen.tsx      # Native app-like splash screen
├── hooks.ts              # PWA React hooks
├── components.tsx        # Install prompts & update UI
└── index.ts              # Centralized exports
```

#### **Service Worker Features**
- **Offline Caching** - Cache API responses and static assets
- **Background Sync** - Retry failed requests when online
- **Push Notifications** - Engage users with timely updates
- **Update Management** - Prompt users for new versions

### 🔧 **PWA Configuration**

#### **Vite PWA Plugin Setup**
```typescript
// vite.config.ts
VitePWA({
  registerType: 'prompt',
  includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    cleanupOutdatedCaches: true,
    skipWaiting: false, // Require user confirmation for updates
  },
  manifest: {
    name: 'MathLearn - Interactive Math Learning Platform',
    short_name: 'MathLearn',
    description: 'Interactive math learning with personalized lessons',
    theme_color: '#61dafb',
    background_color: '#282c34',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    icons: [
      {
        src: 'icon-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: 'icon-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  }
})
```

#### **PWA Usage Examples**

**Install Prompt Component:**
```typescript
import { InstallPrompt } from '@/core/pwa';

function App() {
  return (
    <div>
      <InstallPrompt />
      {/* Your app content */}
    </div>
  );
}
```

**Update Notification:**
```typescript
import { UpdatePrompt } from '@/core/pwa';

function Layout() {
  return (
    <div>
      <UpdatePrompt />
      {/* Layout content */}
    </div>
  );
}
```

**PWA Hooks:**
```typescript
import { usePWA, useUpdateAvailable } from '@/core/pwa';

function MyComponent() {
  const { isInstallable, install } = usePWA();
  const updateAvailable = useUpdateAvailable();

  return (
    <div>
      {isInstallable && (
        <button onClick={install}>Install App</button>
      )}
      {updateAvailable && (
        <div>New version available!</div>
      )}
    </div>
  );
}
```

### 📱 **Splash Screen**

Custom splash screen for PWA installation:

```typescript
import { SplashScreen } from '@/core/pwa';

function App() {
  const { isVisible, isComplete, onComplete } = useSplashScreen({
    showOnPWA: true,
    duration: 2500
  });

  if (isVisible) {
    return (
      <SplashScreen 
        isVisible={isVisible}
        appName="MathLearn"
        appTagline="Interactive Math Learning"
        logoText="ML"
        onComplete={onComplete}
      />
    );
  }

  return <MainApp />;
}
```

## 🔄 React Query Setup

### 🏗️ **Query Architecture**

#### **Query Client Configuration**
```typescript
// src/core/query/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
      retry: 3,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

#### **Query Provider Setup**
```typescript
// src/core/query/QueryProvider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
```

### 🔑 **Query Keys Management**

Centralized query key factory for consistency:

```typescript
// src/core/query/queryKeys.ts
export const queryKeys = {
  // Lessons
  lessons: {
    all: ['lessons'] as const,
    lists: () => [...queryKeys.lessons.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.lessons.lists(), { filters }] as const,
    details: () => [...queryKeys.lessons.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.lessons.details(), id] as const,
  },
  
  // User Profile
  profile: {
    all: ['profile'] as const,
    user: (userId: string) => [...queryKeys.profile.all, userId] as const,
    progress: (userId: string) => [...queryKeys.profile.user(userId), 'progress'] as const,
  },
  
  // Recommendations
  recommendations: {
    all: ['recommendations'] as const,
    user: (userId: string) => [...queryKeys.recommendations.all, userId] as const,
    adaptive: (userId: string, limit: number) => [
      ...queryKeys.recommendations.user(userId), 
      'adaptive', 
      { limit }
    ] as const,
  },
} as const;
```

### 📊 **Query Usage Examples**

#### **Basic Query Hook**
```typescript
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import { queryKeys } from '@/core/query/queryKeys';

function useLessons() {
  return useQuery({
    queryKey: queryKeys.lessons.lists(),
    queryFn: () => apiClient.get('/lessons'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

#### **Mutation with Optimistic Updates**
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useSubmitLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (submission: LessonSubmission) => 
      apiClient.post(`/lessons/${submission.lessonId}/submit`, submission),
    
    onMutate: async (submission) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: queryKeys.lessons.detail(submission.lessonId) 
      });

      // Snapshot previous value
      const previousLesson = queryClient.getQueryData(
        queryKeys.lessons.detail(submission.lessonId)
      );

      // Optimistically update
      queryClient.setQueryData(
        queryKeys.lessons.detail(submission.lessonId),
        (old: any) => ({
          ...old,
          progress: {
            ...old.progress,
            attemptsCount: old.progress.attemptsCount + 1,
          },
        })
      );

      return { previousLesson };
    },

    onError: (err, submission, context) => {
      // Rollback on error
      queryClient.setQueryData(
        queryKeys.lessons.detail(submission.lessonId),
        context?.previousLesson
      );
    },

    onSettled: (data, error, submission) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.lessons.detail(submission.lessonId) 
      });
    },
  });
}
```

#### **Advanced Query Utilities**
```typescript
// src/core/query/queryUtils.ts

// Bulk invalidation utility
export function useInvalidateQueries() {
  const queryClient = useQueryClient();
  
  return useCallback((patterns: string[][]) => {
    patterns.forEach(pattern => {
      queryClient.invalidateQueries({ queryKey: pattern });
    });
  }, [queryClient]);
}

// Cache cleanup utility
export function useRemoveQueries() {
  const queryClient = useQueryClient();
  
  return useCallback((patterns: string[][]) => {
    patterns.forEach(pattern => {
      queryClient.removeQueries({ queryKey: pattern });
    });
  }, [queryClient]);
}

// Optimistic update utility
export function useOptimisticUpdate() {
  const queryClient = useQueryClient();
  
  return useCallback(<T>(
    queryKey: string[],
    updater: (old: T) => T
  ) => {
    queryClient.setQueryData(queryKey, updater);
  }, [queryClient]);
}
```

## 🌐 Internationalization (i18n)

### 🏗️ **i18n Architecture**

```
src/core/i18n/
├── components/
│   ├── LanguageSwitcher.tsx     # Language switching UI
│   └── I18nRouteWrapper.tsx     # Route-based language detection
├── locales/
│   ├── en/                      # English translations
│   │   ├── common.json          # Common UI elements
│   │   ├── navigation.json      # Navigation items
│   │   ├── lessons.json         # Lesson-related content
│   │   └── errors.json          # Error messages
│   └── id/                      # Indonesian translations
│       ├── common.json
│       ├── navigation.json
│       ├── lessons.json
│       └── errors.json
├── config.ts                    # i18n configuration
├── hooks.ts                     # Translation hooks
└── index.ts                     # Centralized exports
```

### 🚀 **Supported Languages**

- **🇺🇸 English** (default) - Access via `/` or `/path`
- **🇮🇩 Bahasa Indonesia** - Access via `/id` or `/id/path`

### ✨ **i18n Features**

#### **Intelligent Routing**
- **Default Language**: Routes like `/`, `/lessons` default to English
- **Localized Routes**: Routes like `/id`, `/id/lessons` use Indonesian
- **Automatic Detection**: Browser language preference detection
- **Persistent Choice**: Language selection saved in localStorage

#### **Configuration**
```typescript
// src/core/i18n/config.ts
export const SUPPORTED_LANGUAGES = {
  en: { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
  id: { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩', dir: 'ltr' },
} as const;

export const DEFAULT_LANGUAGE = 'en';

// Detection order: URL path → localStorage → browser → default
const resources = {
  en: {
    common: enCommon,
    navigation: enNavigation,
    lessons: enLessons,
    errors: enErrors,
  },
  id: {
    common: idCommon,
    navigation: idNavigation,
    lessons: idLessons,
    errors: idErrors,
  },
};
```

### 🛠️ **Usage Examples**

#### **Basic Translation Hook**
```typescript
import { useTranslation } from '@/core/i18n';

function WelcomeMessage() {
  const { t } = useTranslation('common');
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('subtitle')}</p>
      <button>{t('buttons.start')}</button>
    </div>
  );
}
```

#### **Cross-namespace Translation**
```typescript
function NavigationMenu() {
  const { t } = useTranslation('navigation');
  
  return (
    <nav>
      <Link to="/lessons">{t('lessons')}</Link>
      <Link to="/profile">{t('profile')}</Link>
      {/* Access other namespaces */}
      <span>{t('common:loading', { ns: 'common' })}</span>
    </nav>
  );
}
```

#### **Language Switcher**
```typescript
import { LanguageSwitcher } from '@/core/i18n';

function Header() {
  return (
    <header>
      <h1>MathLearn</h1>
      <LanguageSwitcher variant="dropdown" />
    </header>
  );
}

// Available variants:
// - dropdown: Full dropdown with flags and names
// - buttons: Toggle button style
// - minimal: Compact flag-only switcher
```

#### **Localized Routing**
```typescript
import { useLocalizedRoutes } from '@/core/i18n';

function AppNavigation() {
  const { routes } = useLocalizedRoutes();
  
  return (
    <nav>
      <Link to={routes.home}>Home</Link>
      <Link to={routes.lessons}>Lessons</Link>
      <Link to={routes.profile}>Profile</Link>
    </nav>
  );
}
```

#### **Translation Files Structure**

**English (`en/common.json`):**
```json
{
  "welcome": "Welcome to MathLearn",
  "subtitle": "Interactive math learning platform",
  "buttons": {
    "start": "Start Learning",
    "continue": "Continue",
    "save": "Save Progress"
  },
  "loading": "Loading...",
  "errors": {
    "networkError": "Network connection error",
    "tryAgain": "Please try again"
  }
}
```

**Indonesian (`id/common.json`):**
```json
{
  "welcome": "Selamat datang di MathLearn",
  "subtitle": "Platform pembelajaran matematika interaktif",
  "buttons": {
    "start": "Mulai Belajar",
    "continue": "Lanjutkan",
    "save": "Simpan Progres"
  },
  "loading": "Memuat...",
  "errors": {
    "networkError": "Kesalahan koneksi jaringan",
    "tryAgain": "Silakan coba lagi"
  }
}
```

## 🎨 Styling & UI

### 🎯 **Tailwind CSS Configuration**

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        accent: '#61dafb',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### 🧩 **Component Examples**

#### **Lesson Card Component**
```typescript
interface LessonCardProps {
  lesson: Lesson;
  progress?: LessonProgress;
  onClick: () => void;
}

function LessonCard({ lesson, progress, onClick }: LessonCardProps) {
  const { t } = useTranslation('lessons');
  
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          {lesson.title}
        </h3>
        {progress?.isCompleted && (
          <div className="flex items-center text-green-600">
            <CheckCircleIcon className="w-5 h-5 mr-1" />
            <span className="text-sm font-medium">
              {progress.score}%
            </span>
          </div>
        )}
      </div>
      
      <p className="text-gray-600 mb-4">
        {lesson.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {lesson.difficulty}
          </span>
          <span className="text-sm text-gray-500">
            {lesson.xpReward} XP
          </span>
        </div>
        
        <button
          onClick={onClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          {progress?.isCompleted ? t('review') : t('start')}
        </button>
      </div>
    </div>
  );
}
```

#### **Loading Spinner**
```typescript
function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`animate-spin ${sizeClasses[size]} ${className}`}>
      <div className="w-full h-full border-2 border-blue-600 border-t-transparent rounded-full"></div>
    </div>
  );
}
```

### 📱 **Responsive Design**

```css
/* Mobile-first approach with Tailwind */
.lesson-grid {
  @apply grid grid-cols-1 gap-4;
  @apply md:grid-cols-2 md:gap-6;
  @apply lg:grid-cols-3 lg:gap-8;
}

.navigation-menu {
  @apply flex flex-col space-y-2;
  @apply md:flex-row md:space-y-0 md:space-x-6;
}

.card-container {
  @apply p-4 rounded-lg shadow-sm;
  @apply hover:shadow-md transition-shadow duration-200;
  @apply focus-within:ring-2 focus-within:ring-blue-500;
}
```

## 📊 SEO & Analytics

### 🔍 **SEO Implementation**

#### **Meta Tag Management**
```typescript
import { SEOHead } from '@/core/seo';

function LessonPage({ lesson }: { lesson: Lesson }) {
  return (
    <>
      <SEOHead
        title={`${lesson.title} - MathLearn`}
        description={lesson.description}
        keywords={`math, learning, ${lesson.title.toLowerCase()}`}
        canonical={`/lessons/${lesson.id}`}
        openGraph={{
          type: 'article',
          image: lesson.imageUrl,
        }}
      />
      <main>
        {/* Lesson content */}
      </main>
    </>
  );
}
```

#### **Structured Data**
```typescript
import { StructuredData } from '@/core/seo';

function CourseOverview({ course }: { course: Course }) {
  return (
    <>
      <StructuredData
        type="Course"
        data={{
          name: course.title,
          description: course.description,
          provider: {
            name: "MathLearn",
            url: "https://mathlearn.com"
          },
          educationalLevel: course.level,
          timeRequired: `PT${course.estimatedHours}H`,
        }}
      />
      {/* Course content */}
    </>
  );
}
```

### 📈 **Analytics Integration**

#### **Google Analytics Setup**
```typescript
// Environment configuration
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

// Automatic initialization with built-in tracking
import { usePageTracking } from '@/core/seo';

function App() {
  usePageTracking(); // Automatically tracks page views
  
  return <Router />;
}
```

#### **Custom Event Tracking**
```typescript
import { trackEvent } from '@/core/analytics';

function LessonCompleteButton({ lesson }: { lesson: Lesson }) {
  const handleComplete = () => {
    trackEvent('lesson_completed', {
      lesson_id: lesson.id,
      lesson_title: lesson.title,
      difficulty: lesson.difficulty,
      completion_time: performance.now(),
    });
  };

  return (
    <button onClick={handleComplete}>
      Complete Lesson
    </button>
  );
}
```

## 🛠️ Development

### 🔧 **Development Tools**

#### **TypeScript Configuration**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### **Vite Configuration**
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react(),
    VitePWA({...}),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          i18n: ['react-i18next', 'i18next'],
        },
      },
    },
  },
});
```

### 🧪 **Code Quality**

#### **ESLint Configuration**
```json
{
  "extends": [
    "@repo/eslint-config/react-internal"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/prop-types": "off"
  }
}
```

#### **Pre-commit Hooks**
```bash
# Automatically runs on commit
npm run type-check  # TypeScript validation
npm run lint        # ESLint checks
npm run format      # Prettier formatting
```

### 🔍 **Debugging**

#### **React Query Devtools**
```typescript
// Enabled in development
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Automatically included in QueryProvider
{import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
```

#### **Debug Environment Variables**
```bash
VITE_DEBUG_MODE=true              # Enable debug logging
VITE_I18N_DEBUG=true              # Show missing translations
VITE_SHOW_PERFORMANCE_METRICS=true # Show performance metrics
```

## 🚀 Deployment

### 📦 **Build Process**

```bash
# Development build
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

### 🌐 **Deployment Targets**

#### **Static Hosting (Vercel, Netlify)**
```bash
# Build command
npm run build

# Output directory
dist/

# Environment variables to set:
VITE_API_URL=https://api.mathlearn.com
VITE_BASE_URL=https://mathlearn.com
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### **Docker Deployment**
```dockerfile
# Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### **Environment Configuration**
```bash
# Production
VITE_BASE_URL=https://mathlearn.com
VITE_API_URL=https://api.mathlearn.com
VITE_DEBUG_MODE=false
VITE_ENABLE_ANALYTICS=true

# Staging
VITE_BASE_URL=https://staging.mathlearn.com
VITE_API_URL=https://api-staging.mathlearn.com
VITE_DEBUG_MODE=true
VITE_ENABLE_ANALYTICS=false
```

## 🧪 Testing

### 🔬 **Testing Strategy**

#### **Unit Testing with Vitest**
```typescript
// src/features/lessons/components/__tests__/LessonCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { LessonCard } from '../LessonCard';

describe('LessonCard', () => {
  const mockLesson = {
    id: '1',
    title: 'Basic Math',
    description: 'Learn basic math concepts',
    difficulty: 'easy',
    xpReward: 10,
  };

  it('renders lesson information correctly', () => {
    render(<LessonCard lesson={mockLesson} onClick={vi.fn()} />);
    
    expect(screen.getByText('Basic Math')).toBeInTheDocument();
    expect(screen.getByText('Learn basic math concepts')).toBeInTheDocument();
    expect(screen.getByText('10 XP')).toBeInTheDocument();
  });

  it('calls onClick when button is clicked', () => {
    const handleClick = vi.fn();
    render(<LessonCard lesson={mockLesson} onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### **Integration Testing**
```typescript
// src/features/lessons/__tests__/LessonsList.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { LessonsList } from '../LessonsList';

const server = setupServer(
  rest.get('/api/lessons', (req, res, ctx) => {
    return res(ctx.json({ 
      success: true, 
      data: [mockLesson] 
    }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('LessonsList Integration', () => {
  it('fetches and displays lessons', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <LessonsList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Basic Math')).toBeInTheDocument();
    });
  });
});
```

#### **E2E Testing Setup**
```typescript
// e2e/lessons.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Lessons Flow', () => {
  test('should complete a lesson successfully', async ({ page }) => {
    await page.goto('/lessons');
    
    // Click on first lesson
    await page.click('[data-testid="lesson-card"]:first-child');
    
    // Answer questions
    await page.click('[data-testid="answer-option"]:first-child');
    await page.click('[data-testid="submit-answer"]');
    
    // Check completion
    await expect(page.locator('[data-testid="lesson-complete"]')).toBeVisible();
  });
});
```

### 🔧 **Test Configuration**

#### **Vitest Setup**
```typescript
// vitest.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

#### **Test Utilities**
```typescript
// src/test/utils.tsx
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n-mock';

export function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        {ui}
      </I18nextProvider>
    </QueryClientProvider>
  );
}
```

---

## 📚 Additional Resources

### 🔗 **Related Documentation**
- [Main Project README](../../README.md) - Root project documentation
- [Backend API Documentation](../backend/README.md) - API endpoints and services
- [Environment Configuration Guide](./ENVIRONMENT.md) - Detailed environment setup

### 🛠️ **Technology Stack**
- [React 18](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [TanStack Query](https://tanstack.com/query) - Server state management
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [React i18next](https://react.i18next.com/) - Internationalization
- [Vite PWA](https://vite-pwa-org.netlify.app/) - Progressive Web App features

### 🤝 **Contributing**
- Follow the established file structure and naming conventions
- Use TypeScript for all new code
- Add proper translations for new UI text
- Include unit tests for new components
- Update this documentation for significant changes

---

**Happy coding! 🚀**

For questions or support, please refer to the main project documentation or open an issue on GitHub.
