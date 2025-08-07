# Backend Architecture Documentation

## 🏗️ NestJS-like Modular Architecture

This backend follows a modular architecture pattern similar to NestJS, providing clear separation of concerns and maintainable code structure.

## 📁 Folder Structure

```
src/
├── core/                     # Core functionality and shared utilities
│   ├── interfaces/           # TypeScript interfaces and types
│   │   └── index.ts
│   ├── middleware/          # Express middleware utilities
│   │   └── index.ts
│   ├── base.ts              # Base classes for controllers, services, modules
│   └── index.ts             # Core exports
├── features/                # Feature modules (business logic)
│   ├── health/              # Health check module
│   │   ├── health.controller.ts
│   │   ├── health.service.ts
│   │   ├── health.module.ts
│   │   └── index.ts
│   ├── users/               # User management module
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.module.ts
│   │   ├── user.interface.ts
│   │   └── index.ts
│   └── index.ts
├── app.ts                   # Application class (main app configuration)
└── index.ts                 # Entry point
```

## 🧩 Architecture Components

### 1. **Core Layer** (`src/core/`)

**Base Classes:**
- `BaseController`: Abstract class for all controllers
- `BaseService`: Abstract class for all services  
- `BaseModule`: Abstract class for all modules

**Interfaces:**
- `IController`: Controller contract
- `IService`: Service contract
- `IModule`: Module contract
- `ApiResponse<T>`: Standardized API response format
- `PaginatedResponse<T>`: Paginated response format

**Middleware:**
- `asyncHandler`: Async error handling wrapper
- `createResponse`: Standardized response creator
- `sendSuccess`: Success response helper
- `sendError`: Error response helper
- `errorHandler`: Global error middleware
- `notFoundHandler`: 404 handler

### 2. **Feature Modules** (`src/features/`)

Each feature follows the **Controller → Service → Module** pattern:

#### Module Structure:
```typescript
// service.ts - Business logic
class FeatureService extends BaseService {
  // Database operations, business logic
}

// controller.ts - Route handling
class FeatureController extends BaseController {
  constructor(private service: FeatureService) {}
  // Route definitions and request handling
}

// module.ts - Module configuration
class FeatureModule extends BaseModule {
  constructor() {
    this.service = new FeatureService();
    this.controller = new FeatureController(this.service);
  }
}
```

### 3. **Application Layer** (`src/app.ts`)

The `Application` class manages:
- Express app configuration
- Middleware setup
- Module registration
- Error handling
- Route organization

## 📊 API Endpoints

### Health Module (`/api/health`)
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed system health

### Users Module (`/api/users`)
- `GET /api/users` - Get all users (with pagination & search)
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🔧 Key Features

### ✅ **Standardized Responses**
All API responses follow a consistent format:
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful",
  "timestamp": "2025-08-07T17:47:48.723Z"
}
```

### ✅ **Error Handling**
- Async error handling with `asyncHandler`
- Global error middleware
- Standardized error responses
- Development vs production error details

### ✅ **Type Safety**
- Full TypeScript coverage
- Interface definitions for all data structures
- Typed request/response handlers

### ✅ **Modular Design**
- Easy to add new features
- Clear separation of concerns
- Reusable base classes
- Dependency injection pattern

### ✅ **Built-in Features**
- Request logging (development mode)
- CORS and security headers
- Input validation
- Pagination support
- Search functionality

## 🆕 Adding New Features

To add a new feature module:

1. **Create feature folder:**
   ```bash
   mkdir src/features/new-feature
   ```

2. **Create service:**
   ```typescript
   // new-feature.service.ts
   export class NewFeatureService extends BaseService {
     async getData() { /* business logic */ }
   }
   ```

3. **Create controller:**
   ```typescript
   // new-feature.controller.ts
   export class NewFeatureController extends BaseController {
     constructor(private service: NewFeatureService) { super(); }
     initializeRoutes() { /* define routes */ }
   }
   ```

4. **Create module:**
   ```typescript
   // new-feature.module.ts
   export class NewFeatureModule extends BaseModule {
     constructor() {
       this.service = new NewFeatureService();
       this.controller = new NewFeatureController(this.service);
     }
   }
   ```

5. **Register in app.ts:**
   ```typescript
   this.app.use('/api/new-feature', newFeatureModule.initialize());
   ```

## 🎯 Benefits

- **Maintainable**: Clear structure and separation of concerns
- **Scalable**: Easy to add new features and modules
- **Testable**: Isolated components with dependency injection
- **Type-Safe**: Full TypeScript coverage
- **Consistent**: Standardized patterns and responses
- **Production-Ready**: Error handling, logging, and security
