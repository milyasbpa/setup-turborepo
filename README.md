# 🚀 Turborepo Math Learning App

A modern monorepo setup featuring a **Duolingo-style math learning app** with **Express.js TypeScript backend** and **Vite React TypeScript frontend**, powered by Turborepo for efficient development and building.

## 📋 What's Inside?

This Turborepo includes the following packages and apps:

### 🏗️ Apps
- **`backend`** - Express.js TypeScript API server with math learning features (Port 3002)
- **`frontend`** - Vite React TypeScript application with i18n support (Port 3000)

### 📦 Packages
- **`@repo/eslint-config`** - Shared ESLint configurations
- **`@repo/typescript-config`** - Shared TypeScript configurations

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ 
- **npm** 8+
- **Git** for cloning the repository

### 📥 Installation & Setup

1. **Clone the repository**:
```bash
git clone https://github.com/milyasbpa/setup-turborepo.git
cd setup-turborepo
```

2. **Install all dependencies**:
```bash
npm install
```
This will install dependencies for all apps and packages in the monorepo.

3. **Set up environment variables and Docker database**:
```bash
# Copy the backend environment template
cp apps/backend/.env.example apps/backend/.env

# Start PostgreSQL with Docker (requires Docker Desktop)
cd apps/backend
docker-compose up -d

# Set up database schema and demo data
npm run db:generate
npm run db:push
npm run db:seed
cd ../..
```

> **Note**: This project uses Docker for PostgreSQL. Make sure [Docker Desktop](https://www.docker.com/products/docker-desktop/) is installed and running. The `.env` file is pre-configured for the Docker setup.

4. **Start development servers**:
```bash
npm run dev
```

🎉 **That's it!** Your math learning applications are now running:
- 🎯 **Backend API**: http://localhost:3001
- 🌐 **Frontend App**: http://localhost:5173 (Vite default)
- 🌍 **Frontend App (Indonesian)**: http://localhost:5173/id
- 🔗 **API Health Check**: http://localhost:3001/api/health
- 📖 **API Documentation**: http://localhost:3001/api/docs
- 🎓 **Math Lessons API**: http://localhost:3001/api/lessons
- 🐳 **PostgreSQL Database**: localhost:5432 (Docker container)
- 🗄️ **pgAdmin** (optional): http://localhost:8080

### 🔥 Quick Verification

After installation, verify everything works:

1. **Run the verification script**:
```bash
./verify-setup.sh
```

2. **Manual verification**:

1. **Run the verification script**:
```bash
./verify-setup.sh
```

2. **Manual verification**:
   - **Open your browser** to http://localhost:5173
   - **Check the math learning app** displays and shows backend status
   - **Test lesson endpoints** by visiting http://localhost:3001/api/lessons
   - **Try the API documentation** at http://localhost:3001/api/docs
   - **Test language switching** using the language switcher in the header
   - **Try localized routes** by visiting http://localhost:5173/id

If you see the React app loading math lessons from the backend, you're all set! 🚀

## 📜 Available Scripts

### 🔄 Development Commands

```bash
# Start both applications in development mode
npm run dev

# Run database management commands
npm run db:migrate      # Run database migrations
npm run db:seed         # Seed database with demo data
npm run db:cleanup      # Clean up math learning data
npm run db:seed:reset   # Clean and re-seed database

# Run TypeScript type checking across all packages
npm run type-check

# Run ESLint across all packages
npm run lint

# Clean build artifacts
npm run clean
```

### 🔧 Individual App Commands

#### Backend (Express.js Math Learning API)
```bash
cd apps/backend

npm run dev        # Development with hot reload
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # ESLint
npm run type-check # TypeScript validation

# Database management
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Run database migrations
npm run db:seed       # Seed with demo math lessons
npm run db:cleanup    # Clean up math learning data
```

#### Frontend (React App)
```bash
cd apps/frontend

npm run dev        # Development with hot reload
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # ESLint
npm run type-check # TypeScript validation
```

### 🪝 Git Hooks & Code Quality

This project uses **Husky** and **Commitlint** to maintain code quality and consistent commit messages.

#### Pre-commit Hook
Automatically runs before each commit:
```bash
# Runs automatically on git commit
📝 Type checking...
🔧 Linting...
```

#### Commit Message Format
Follows [Conventional Commits](https://conventionalcommits.org/) specification:

```bash
type(scope): description

# Examples:
feat: add user authentication
fix(api): resolve CORS issue
docs: update README setup instructions
style: format code with prettier
refactor(backend): optimize database queries
test: add unit tests for user service
```

**Allowed types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `build` - Build system changes
- `ci` - CI/CD changes
- `chore` - Other changes
- `revert` - Revert previous commit

#### Manual Commands
```bash
# Test commit message format
npm run commitlint

# Manually run pre-commit checks
npm run type-check && npm run lint
```

## 🏗️ Project Structure

```
├── apps/
│   ├── backend/                 # Express.js TypeScript Math Learning API
│   │   ├── src/
│   │   │   ├── features/        # Math learning features (lessons, profile)
│   │   │   ├── core/            # Core functionality (database, repositories)
│   │   │   └── index.ts         # Main server file
│   │   ├── prisma/              # Database schema and migrations
│   │   │   ├── schema.prisma    # Math learning database schema
│   │   │   ├── migrations/      # Database migration files
│   │   │   └── seeds/           # JSON-based demo data
│   │   ├── .env.example         # Environment template
│   │   ├── .env                 # Environment variables
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .eslintrc.js
│   └── frontend/                # Vite React TypeScript app
│       ├── src/
│       │   ├── core/
│       │   │   ├── api/         # API client and configuration
│       │   │   ├── i18n/        # Internationalization system
│       │   │   │   ├── components/  # LanguageSwitcher, I18nRouteWrapper
│       │   │   │   ├── locales/     # Translation files (en/, id/)
│       │   │   │   ├── config.ts    # i18n configuration
│       │   │   │   ├── hooks.ts     # Translation hooks
│       │   │   │   └── index.ts     # i18n exports
│       │   │   ├── layout/      # Layout components
│       │   │   ├── pwa/         # PWA functionality
│       │   │   ├── query/       # React Query setup
│       │   │   └── router/      # Routing configuration
│       │   ├── features/        # Feature-specific components
│       │   ├── types/           # TypeScript declarations
│       │   ├── App.tsx          # Main React component
│       │   ├── main.tsx         # React entry point
│       │   ├── App.css          # Styles
│       │   └── vite-env.d.ts    # Vite type definitions
│       ├── index.html           # HTML template
│       ├── package.json
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       ├── vite.config.ts       # Vite configuration
│       └── .eslintrc.json
├── packages/
│   ├── eslint-config/           # Shared ESLint configurations
│   │   ├── library.js
│   │   ├── node.js
│   │   ├── react-internal.js
│   │   └── package.json
│   └── typescript-config/       # Shared TypeScript configurations
│       ├── base.json
│       ├── node.json
│       ├── react-library.json
│       └── package.json
├── package.json                 # Root package configuration
├── turbo.json                   # Turborepo configuration
├── .gitignore
└── README.md
```

## ✨ Features

### 🔧 Backend Features
- **Math Learning System** with lessons, problems, and progress tracking
- **XP and Streak System** with daily streak tracking and experience points
- **Prisma ORM** with PostgreSQL database and type-safe queries
- **Swagger Documentation** for comprehensive API documentation
- **Zod Validation** for robust input validation and type safety
- **Express.js** with TypeScript for robust API development
- **CORS** enabled for cross-origin requests
- **Helmet** for security headers
- **Environment variables** support with dotenv
- **Health check** endpoint (`/api/health`)
- **Math lesson endpoints** for interactive learning (`/api/lessons`)
- **User profile endpoints** with XP/streak stats (`/api/profile`)
- **Error handling** middleware with proper HTTP status codes
- **Development hot reload** with tsx for instant updates

### ⚛️ Frontend Features
- **React 18** with TypeScript for modern UI development
- **Vite** for lightning-fast development and optimized builds
- **React Query (TanStack Query)** for advanced state management and caching
- **React Router DOM** with lazy loading and code splitting
- **Internationalization (i18n)** with React-i18next for multi-language support
- **Progressive Web App (PWA)** with offline support and notifications
- **Service Worker Management** with manual update control
- **Path Aliases** for clean import statements (`@/core`, `@/features`)
- **Axios** for API communication with interceptors
- **Proxy configuration** for seamless API integration
- **Modern CSS** with CSS Grid and Flexbox
- **Responsive design** for all screen sizes
- **Backend status monitoring** and error handling
- **Hot module replacement** for instant UI updates

### 🔧 Development Experience
- **Monorepo management** with Turborepo for efficient builds
- **Shared configurations** for consistent code quality
- **Type safety** across the entire stack
- **Git hooks** with Husky for automated quality checks
- **Commit message linting** with Commitlint for consistent history
- **Pre-commit validation** with automatic linting and type checking
- **Conventional commits** for better project maintenance
- **Hot reload** for both frontend and backend
- **Unified scripts** to manage all applications

## � Math Learning API Endpoints

The backend provides a comprehensive math learning system with the following REST endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Welcome message and server info |
| `GET` | `/api/health` | Health check for monitoring |
| `GET` | `/api/lessons` | Get all math lessons with user progress |
| `GET` | `/api/lessons/:id` | Get specific lesson with problems |
| `POST` | `/api/lessons/:id/submit` | Submit lesson answers (idempotent) |
| `GET` | `/api/lessons/stats` | Get lesson statistics |
| `GET` | `/api/profile` | Get user profile with XP and streak |

### Math Learning Features

- **3 Demo Lessons**: Basic Arithmetic, Multiplication, Division
- **XP System**: 10 XP per correct answer, lesson completion bonuses
- **Streak Tracking**: Daily streak system with automatic reset logic
- **Idempotency**: Submit same `attempt_id` multiple times safely
- **Progress Tracking**: Track completion, scores, and attempt counts

### Example API Responses

**Lessons List:**
```json
{
  "success": true,
  "data": [
    {
      "id": "lesson-1",
      "title": "Basic Arithmetic",
      "description": "Learn addition and subtraction",
      "difficulty": "BEGINNER",
      "xpReward": 10,
      "progress": {
        "isCompleted": false,
        "score": 0,
        "bestScore": 0,
        "attemptsCount": 0
      }
    }
  ]
}
```

**Lesson Details:**
```json
{
  "success": true,
  "data": {
    "id": "lesson-1",
    "title": "Basic Arithmetic",
    "problems": [
      {
        "id": "problem-1-1",
        "question": "What is 5 + 3?",
        "problemType": "MULTIPLE_CHOICE",
        "options": [
          { "id": "opt-1", "optionText": "7" },
          { "id": "opt-2", "optionText": "8" },
          { "id": "opt-3", "optionText": "9" }
        ]
      }
    ]
  }
}
```

**Submit Answers:**
```json
{
  "success": true,
  "data": {
    "score": 80,
    "totalProblems": 4,
    "correctAnswers": 3,
    "isCompleted": true,
    "xpGained": 40,
    "streakUpdated": true,
    "currentXp": 40,
    "currentStreak": 1
  }
}
```
```

## ⚙️ Environment Configuration

### Backend Environment Variables

Copy `apps/backend/.env.example` to `apps/backend/.env`:

```env
# Server Configuration
PORT=3002
NODE_ENV=development

# Database (Required for math learning features)
DATABASE_URL="postgresql://username:password@localhost:5432/mathapp"

# Prisma Configuration
PRISMA_GENERATE_DATAPROXY=false

# Authentication (for future features)
# JWT_SECRET=your-super-secret-jwt-key
# JWT_EXPIRES_IN=7d

# External APIs (when you add them)
# EXTERNAL_API_KEY=your-api-key
```

### Frontend Environment Variables

Create `apps/frontend/.env.local` for frontend-specific variables:

```env
# API Configuration
VITE_API_URL=http://localhost:3002

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_DEBUG_MODE=true
```

## 🔒 Security

- ✅ **No high/critical vulnerabilities** in production dependencies
- ⚠️ **6 low severity vulnerabilities** in development tools (Turbo generators) - these don't affect production
- 🛡️ **Helmet** security headers on backend
- 🔐 **CORS** properly configured
- 🔍 **TypeScript** for compile-time security

## 🚀 Deployment

### Backend Deployment
```bash
cd apps/backend
npm run build
npm start
```

### Frontend Deployment
```bash
cd apps/frontend
npm run build
# Deploy the `dist` folder to your hosting service
```

### Environment Variables for Production
Make sure to set these in your deployment platform:
- `NODE_ENV=production`
- `PORT=3002` (or your preferred port)
- Database connection strings
- API keys and secrets

## 🛠️ Development Tips

### Adding New Dependencies

**Backend dependencies:**
```bash
cd apps/backend
npm install express-rate-limit  # example
```

**Frontend dependencies:**
```bash
cd apps/frontend
npm install react-router-dom    # example
```

**Shared dependencies:**
```bash
npm install -w packages/typescript-config typescript@latest
```

### Creating New Packages

Use Turbo's generator:
```bash
npx turbo gen workspace
```

### Debugging

**Backend debugging:**
```bash
cd apps/backend
npm run dev  # Check logs in terminal
```

**Frontend debugging:**
- Open browser dev tools
- Check Network tab for API calls
- Check Console for React errors

## �️ Troubleshooting

### Common Installation Issues

**❌ Node.js version errors**
```bash
# Check your Node.js version
node --version

# If < 18, update Node.js or use nvm
nvm install 18
nvm use 18
```

**❌ Port already in use**
```bash
# Kill processes on ports 3000 and 3002
lsof -ti:3000,3002 | xargs kill -9

# Or change ports in the config files:
# - apps/backend/.env (PORT=3002)
# - apps/frontend/vite.config.ts (port: 3000)
```

**❌ Dependencies not installing**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**❌ TypeScript errors**
```bash
# Run type checking to see specific errors
npm run type-check

# Check individual apps
cd apps/backend && npm run type-check
cd apps/frontend && npm run type-check
```

**❌ Backend not connecting to frontend**
- Verify backend is running on http://localhost:3002
- Check frontend proxy config in `apps/frontend/vite.config.ts`
- Look for CORS errors in browser console

### Fresh Installation

If you encounter persistent issues, try a fresh installation:

```bash
# Remove everything and start over
rm -rf node_modules apps/*/node_modules package-lock.json
npm install
npm run dev
```

## 📚 Architecture Documentation

This project includes comprehensive documentation for advanced features:

### 🔄 React Query (TanStack Query)
- **Location**: `apps/frontend/REACT_QUERY_SETUP.md`
- **Features**: Advanced state management, caching, mutations, optimistic updates
- **Usage**: Type-safe hooks, centralized query keys, automatic invalidation

### 📱 Progressive Web App (PWA)
- **Location**: `apps/frontend/PWA_SETUP.md`
- **Features**: Offline support, push notifications, service workers, install prompts
- **Key Points**: Manual update control, network awareness, notification system

### 🏗️ Scalable Architecture
- **Core/Features Pattern**: Separation of concerns with `/core` for shared functionality
- **Path Aliases**: Clean imports with `@/` patterns
- **TypeScript**: Strict typing throughout the application
- **Error Boundaries**: Graceful error handling and user feedback

Read the individual documentation files for detailed implementation guides and best practices.

## 🌐 Internationalization (i18n)

This project includes a comprehensive internationalization system powered by React-i18next, supporting multiple languages with intelligent routing and user experience.

### 🚀 Supported Languages

- **🇺🇸 English** (default) - Access via `/` or `/path`
- **🇮🇩 Bahasa Indonesia** - Access via `/id` or `/id/path`

### ✨ i18n Features

#### 🧭 Intelligent Routing
- **Default Language**: Routes like `/`, `/users` default to English
- **Localized Routes**: Routes like `/id`, `/id/users` use Indonesian
- **Automatic Detection**: Browser language preference detection
- **Persistent Choice**: Language selection saved in localStorage

#### 🔄 Language Switching
- **Multiple UI Variants**: Dropdown, button, and minimal switchers
- **Visual Indicators**: Flag emojis and language names
- **Smooth Transitions**: Instant language switching without page reload
- **Responsive Design**: Works seamlessly across all device sizes

#### 📁 Translation Structure
```
src/core/i18n/locales/
├── en/ (English)
│   ├── common.json      # Common UI elements, buttons, errors
│   ├── navigation.json  # Navigation, footer, breadcrumbs
│   ├── home.json       # Home page content
│   └── users.json      # Users page content
└── id/ (Indonesian)
    ├── common.json      # UI elements in Indonesian
    ├── navigation.json  # Navigation in Indonesian
    ├── home.json       # Home page in Indonesian
    └── users.json      # Users page in Indonesian
```

### 🛠️ Using i18n in Components

#### Basic Translation Hook
```tsx
import { useTranslation } from '@/core/i18n';

const MyComponent = () => {
  const { t } = useTranslation('common');
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button>{t('save')}</button>
    </div>
  );
};
```

#### Cross-namespace Translation
```tsx
const { t } = useTranslation('home');

// Access other namespaces
const navigationText = t('navigation:users', { ns: 'navigation' });
const commonText = t('common:loading', { ns: 'common' });
```

#### Localized Routing
```tsx
import { useLocalizedRoutes } from '@/core/i18n';

const Navigation = () => {
  const { routes } = useLocalizedRoutes();
  
  return (
    <nav>
      <Link to={routes.home}>Home</Link>
      <Link to={routes.users}>Users</Link>
    </nav>
  );
};
```

#### Language Switcher Integration
```tsx
import { LanguageSwitcher } from '@/core/i18n';

// Multiple variants available
<LanguageSwitcher variant="dropdown" />   // Full dropdown with flags
<LanguageSwitcher variant="buttons" />    // Button toggles
<LanguageSwitcher variant="minimal" />    // Compact flag-only
```

### 🔧 i18n Configuration

The i18n system is configured in `src/core/i18n/config.ts` with:

- **Language Detection**: Path → localStorage → browser → HTML tag
- **Fallback System**: Graceful handling of missing translations
- **Development Tools**: Missing translation warnings in dev mode
- **TypeScript Support**: Full type safety for translation keys

### 🎯 Testing i18n

1. **Language Switching**: Use the language switcher in the header
2. **URL-based Access**: 
   - Visit `/` for English homepage
   - Visit `/id` for Indonesian homepage
   - Try `/users` vs `/id/users` for localized pages
3. **Browser Detection**: Clear localStorage and reload to test auto-detection
4. **Error Pages**: Test 404 pages in both languages

### 📚 Adding New Languages

To add a new language (e.g., Spanish):

1. **Update configuration**:
```typescript
// src/core/i18n/config.ts
export const SUPPORTED_LANGUAGES = {
  en: { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
  id: { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩', dir: 'ltr' },
  es: { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' }, // New
} as const;
```

2. **Create translation files**:
```
src/core/i18n/locales/es/
├── common.json
├── navigation.json
├── home.json
└── users.json
```

3. **Import resources**:
```typescript
// config.ts
import esCommon from './locales/es/common.json';
// ... other imports

const resources = {
  // ... existing languages
  es: {
    common: esCommon,
    navigation: esNavigation,
    home: esHome,
    users: esUsers,
  },
};
```

4. **Update TypeScript declarations** in `src/types/json.d.ts`

### 🌍 i18n Best Practices

- **Namespace Organization**: Group related translations logically
- **Key Naming**: Use descriptive, hierarchical keys (`user.profile.edit`)
- **Interpolation**: Support dynamic content with `t('welcome', { name: 'John' })`
- **Pluralization**: Handle singular/plural forms properly
- **Context**: Provide context for translators when needed
- **Testing**: Test all languages in different scenarios
- **Performance**: Lazy load translation files for better performance

## � SEO & Accessibility

This project includes comprehensive SEO optimization and accessibility features to ensure your application ranks well in search engines and is accessible to all users.

### 🚀 SEO Features

#### 📋 Meta Tag Management
- **React Helmet Async**: Dynamic meta tag management for each page
- **Open Graph Tags**: Rich social media previews for Facebook, LinkedIn
- **Twitter Card Tags**: Optimized Twitter sharing experience
- **Canonical URLs**: Prevent duplicate content issues
- **Language Tags**: Proper hreflang implementation for i18n SEO

#### 🔍 Search Engine Optimization
- **Robots.txt**: Comprehensive crawler directives in `/public/robots.txt`
- **XML Sitemap**: Auto-generated sitemap with i18n support in `/public/sitemap.xml`
- **Structured Data**: Schema.org markup for rich snippets
- **Page Speed**: Optimized loading with Vite and React code splitting
- **Mobile-First**: Responsive design with proper viewport configuration

#### 📊 Analytics & Tracking
- **Google Analytics Ready**: Built-in support for GA4 integration
- **Performance Tracking**: Page load time and user interaction monitoring
- **SEO Monitoring**: Track keyword rankings and search visibility

### ♿ Accessibility Features

#### 🎯 WCAG Compliance
- **Semantic HTML**: Proper heading hierarchy and landmark elements
- **Screen Reader Support**: ARIA labels and live region announcements
- **Keyboard Navigation**: Full keyboard accessibility with focus management
- **Color Contrast**: High contrast ratios for visual accessibility
- **Alternative Text**: Descriptive alt text for all images

#### 🔧 Accessibility Components
- **Skip Links**: Quick navigation for keyboard and screen reader users
- **Focus Management**: Proper focus handling for route changes
- **Loading States**: Accessible loading indicators with announcements
- **Error Messages**: Clear, descriptive error communication

### 🛠️ SEO Component Usage

#### Basic SEO Setup
```tsx
import { SEOHead } from '@/core/seo';

const HomePage = () => {
  return (
    <>
      <SEOHead
        title="Welcome to TurboApp"
        description="A modern React application with TypeScript and i18n support"
        keywords="react, typescript, vite, i18n, turborepo"
        canonical="/"
      />
      <main>
        <h1>Welcome to TurboApp</h1>
      </main>
    </>
  );
};
```

#### Advanced SEO with Structured Data
```tsx
import { SEOHead, StructuredData } from '@/core/seo';

const ArticlePage = () => {
  return (
    <>
      <SEOHead
        title="My Article - TurboApp"
        description="An informative article about web development"
        canonical="/articles/my-article"
        openGraph={{
          type: 'article',
          publishedTime: '2024-01-15T10:00:00Z',
          authors: ['John Doe']
        }}
      />
      <StructuredData
        type="Article"
        data={{
          headline: "My Article",
          author: { name: "John Doe" },
          datePublished: "2024-01-15"
        }}
      />
      <article>
        <h1>My Article</h1>
        <p>Article content...</p>
      </article>
    </>
  );
};
```

#### Accessibility Integration
```tsx
import { SkipToContent, AccessibilityAnnouncer } from '@/core/seo';

const Layout = ({ children }) => {
  return (
    <div>
      <SkipToContent />
      <AccessibilityAnnouncer />
      <nav aria-label="Main navigation">
        {/* Navigation content */}
      </nav>
      <main id="main-content">
        {children}
      </main>
    </div>
  );
};
```

### 🔧 SEO Configuration

#### Robots.txt Configuration
Located in `/public/robots.txt`:
```
User-agent: *
Allow: /
Disallow: /private/
Disallow: /admin/
Crawl-delay: 1

# Sitemap location
Sitemap: https://yoursite.com/sitemap.xml

# Social media bots
User-agent: facebookexternalhit/*
Allow: /

User-agent: Twitterbot
Allow: /
```

#### XML Sitemap
Located in `/public/sitemap.xml` with internationalization:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://yoursite.com/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://yoursite.com/" />
    <xhtml:link rel="alternate" hreflang="id" href="https://yoursite.com/id" />
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

### 📊 SEO Monitoring & Testing

#### Built-in SEO Hooks
```tsx
import { usePageSEO, usePageTracking } from '@/core/seo';

const MyPage = () => {
  // Track page views and SEO metrics
  usePageSEO({
    title: 'My Page',
    description: 'Page description',
    keywords: 'page, keywords'
  });
  
  usePageTracking('page-name');
  
  return <div>Page content</div>;
};
```

#### SEO Testing Checklist
- ✅ **Meta Tags**: Check all pages have unique titles and descriptions
- ✅ **Open Graph**: Test social media sharing with Facebook Debugger
- ✅ **Twitter Cards**: Validate cards with Twitter Card Validator
- ✅ **Structured Data**: Test with Google Rich Results Checker
- ✅ **Mobile-Friendly**: Test with Google Mobile-Friendly Test
- ✅ **Page Speed**: Analyze with Google PageSpeed Insights
- ✅ **Accessibility**: Audit with Lighthouse accessibility score

### 🎯 SEO Best Practices

#### Content Optimization
- **Unique Titles**: Each page should have a unique, descriptive title
- **Meta Descriptions**: Compelling descriptions under 160 characters
- **Heading Structure**: Proper H1-H6 hierarchy for content structure
- **Internal Linking**: Strategic linking between related pages
- **Image Optimization**: Descriptive alt text and optimized file sizes

#### Technical SEO
- **Loading Speed**: Optimize for Core Web Vitals metrics
- **Mobile Responsiveness**: Ensure perfect mobile experience
- **SSL Certificate**: Secure HTTPS connections
- **Clean URLs**: Descriptive, keyword-rich URL structure
- **Error Handling**: Proper 404 pages with helpful navigation

#### International SEO
- **Hreflang Tags**: Proper language and region targeting
- **Localized Content**: Fully translated and culturally adapted content
- **Local Keywords**: Region-specific keyword optimization
- **Currency/Dates**: Proper localization of numbers and dates

### 🔧 Adding Google Analytics

To enable Google Analytics tracking:

1. **Get GA4 Measurement ID** from Google Analytics
2. **Add to environment variables**:
```env
# apps/frontend/.env.local
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

3. **Analytics will auto-initialize** with the built-in tracking hooks

### 🌟 SEO Performance

The SEO implementation provides:
- **100% Lighthouse SEO Score** potential
- **Accessibility Score 95+** with proper implementation
- **Fast Loading Times** with optimized asset delivery
- **Search Engine Friendly** URL structure and meta tags
- **Social Media Optimized** sharing experience
- **Multi-language SEO** support for global reach

## �📚 Learn More

### Turborepo
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Turborepo Examples](https://github.com/vercel/turbo/tree/main/examples)

### Backend (Express.js)
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript with Express](https://expressjs.com/en/guide/typescript.html)

### Frontend (React + Vite)
- [React Documentation](https://reactjs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run type-check && npm run lint`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Turborepo](https://turbo.build/) for the amazing monorepo tooling
- [Vite](https://vitejs.dev/) for the blazing fast frontend tooling
- [Express.js](https://expressjs.com/) for the robust backend framework

---

**Happy coding!** 🎉

If you encounter any issues or have questions, please open an issue on GitHub.
