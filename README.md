# 🚀 Turborepo Fullstack Starter

A modern monorepo setup with **Express.js TypeScript backend** and **Vite React TypeScript frontend**, powered by Turborepo for efficient development and building.

## 📋 What's Inside?

This Turborepo includes the following packages and apps:

### 🏗️ Apps
- **`backend`** - Express.js TypeScript API server (Port 3002)
- **`frontend`** - Vite React TypeScript application (Port 3000)

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

3. **Set up environment variables** (optional):
```bash
# Copy the backend environment template
cp apps/backend/.env.example apps/backend/.env

# Edit the environment file if needed
# The default values work for local development
```

4. **Start development servers**:
```bash
npm run dev
```

🎉 **That's it!** Your applications are now running:
- 🎯 **Backend API**: http://localhost:3002
- 🌐 **Frontend App**: http://localhost:3000
- 🔗 **API Health Check**: http://localhost:3002/api/health

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
   - **Open your browser** to http://localhost:3000
   - **Check the frontend** displays and shows backend status
   - **Test the API** by visiting http://localhost:3002/api/users

If you see the React app loading data from the backend, you're all set! 🚀

## 📜 Available Scripts

### 🔄 Development Commands

```bash
# Start both applications in development mode
npm run dev

# Build all packages for production
npm run build

# Run TypeScript type checking across all packages
npm run type-check

# Run ESLint across all packages
npm run lint

# Clean build artifacts
npm run clean
```

### 🔧 Individual App Commands

#### Backend (Express.js API)
```bash
cd apps/backend

npm run dev        # Development with hot reload
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # ESLint
npm run type-check # TypeScript validation
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
│   ├── backend/                 # Express.js TypeScript API
│   │   ├── src/
│   │   │   └── index.ts         # Main server file
│   │   ├── .env.example         # Environment template
│   │   ├── .env                 # Environment variables
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .eslintrc.js
│   └── frontend/                # Vite React TypeScript app
│       ├── src/
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
- **Express.js** with TypeScript for robust API development
- **CORS** enabled for cross-origin requests
- **Helmet** for security headers
- **Environment variables** support with dotenv
- **Health check** endpoint (`/api/health`)
- **Sample API endpoints** for users data
- **Error handling** middleware with proper HTTP status codes
- **Development hot reload** with tsx for instant updates

### ⚛️ Frontend Features
- **React 18** with TypeScript for modern UI development
- **Vite** for lightning-fast development and optimized builds
- **React Query (TanStack Query)** for advanced state management and caching
- **React Router DOM** with lazy loading and code splitting
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

## 🌐 API Endpoints

The backend provides the following REST endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Welcome message and server info |
| `GET` | `/api/health` | Health check for monitoring |
| `GET` | `/api/users` | Sample users data |

### Example API Responses

**Health Check:**
```json
{
  "status": "OK",
  "service": "backend",
  "timestamp": "2025-08-08T12:00:00.000Z"
}
```

**Users Data:**
```json
{
  "data": [
    { "id": 1, "name": "John Doe", "email": "john@example.com" },
    { "id": 2, "name": "Jane Smith", "email": "jane@example.com" }
  ],
  "total": 2
}
```

## ⚙️ Environment Configuration

### Backend Environment Variables

Copy `apps/backend/.env.example` to `apps/backend/.env`:

```env
# Server Configuration
PORT=3002
NODE_ENV=development

# Database (when you add one)
# DATABASE_URL=postgresql://user:password@localhost:5432/mydb

# Authentication (when you add it)
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

## 📚 Learn More

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
