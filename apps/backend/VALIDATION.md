# Zod Validation & Swagger Integration

## Overview
Comprehensive API validation using Zod schemas with automatic Swagger/OpenAPI documentation generation and scalable DTO architecture.

## Features
✅ **Zod Validation**: Type-safe request/response validation with detailed error messages  
✅ **DTO Architecture**: Strongly typed DTOs for all API endpoints  
✅ **Swagger Integration**: Automatic OpenAPI 3.0 documentation generation  
✅ **Request Validation**: Body, query, params, and headers validation  
✅ **Response Schemas**: Structured API responses with consistent formatting  
✅ **Error Handling**: Comprehensive validation error reporting  
✅ **OpenAPI Export**: Script to generate OpenAPI JSON specification  

## Validation Architecture

### Core Components
```
src/core/validation/
├── validation.middleware.ts    # Zod validation middleware
├── validation.schemas.ts       # Common schemas and utilities
├── dto.types.ts               # Base DTO types and interfaces
└── index.ts                   # Barrel exports

src/core/swagger/
├── swagger.config.ts          # Swagger/OpenAPI configuration
└── index.ts                   # Swagger exports
```

### Module-Specific DTOs
```
src/features/[module]/
├── [module].dto.ts            # Request/response DTOs
├── [module].swagger.ts        # Swagger documentation
└── [module].controller.ts     # Controller with validation
```

## Usage Examples

### 1. Request Validation

#### Body Validation
```typescript
import { validateBody } from '../../core/validation';
import { CreateUserSchema } from './user.dto';

// Apply validation middleware
this.router.post('/', 
  validateBody(CreateUserSchema),
  asyncHandler(this.createUser.bind(this))
);

// Use validated data in controller
private async createUser(req: Request, res: Response): Promise<void> {
  const userData = req.validated?.body as CreateUserDto;
  // userData is now type-safe and validated
}
```

#### Query Parameter Validation
```typescript
import { validateQuery } from '../../core/validation';
import { UserQuerySchema } from './user.dto';

this.router.get('/', 
  validateQuery(UserQuerySchema),
  asyncHandler(this.getAllUsers.bind(this))
);
```

#### Route Parameter Validation
```typescript
import { validateParams } from '../../core/validation';
import { UserParamsSchema } from './user.dto';

this.router.get('/:id', 
  validateParams(UserParamsSchema),
  asyncHandler(this.getUserById.bind(this))
);
```

### 2. DTO Definitions

#### User DTOs Example
```typescript
import { z } from 'zod';
import { createApiResponse, createPaginatedResponse } from '../../core/validation';

// Entity schema
export const UserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Request schemas
export const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email format'),
});

export const UserQuerySchema = z.object({
  page: z.string().transform(val => parseInt(val, 10)).pipe(z.number().int().min(1)).default('1'),
  limit: z.string().transform(val => parseInt(val, 10)).pipe(z.number().int().min(1).max(100)).default('10'),
  search: z.string().optional(),
  sortBy: z.enum(['id', 'name', 'email', 'createdAt']).default('id'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Response schemas
export const UserResponseSchema = createApiResponse(UserSchema);
export const UsersListResponseSchema = createPaginatedResponse(UserSchema);

// TypeScript types
export type UserDto = z.infer<typeof UserSchema>;
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UserQueryDto = z.infer<typeof UserQuerySchema>;
```

### 3. Swagger Documentation

#### Schema Documentation
```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 */
```

#### Endpoint Documentation
```typescript
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
```

## Validation Examples

### Successful Request
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}' \
  http://localhost:3002/api/users
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-08-08T01:22:10.946Z",
    "updatedAt": "2025-08-08T01:22:10.946Z"
  },
  "message": "User created successfully",
  "timestamp": "2025-08-08T01:22:10.947Z"
}
```

### Validation Error
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"","email":"invalid-email"}' \
  http://localhost:3002/api/users
```

**Response:**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "name",
      "message": "Name is required",
      "code": "too_small"
    },
    {
      "field": "email",
      "message": "Invalid email format",
      "code": "invalid_string"
    }
  ],
  "timestamp": "2025-08-08T01:21:42.993Z"
}
```

### Query Parameter Validation Error
```bash
curl "http://localhost:3002/api/users?page=invalid&limit=200"
```

**Response:**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "page",
      "message": "Expected number, received nan",
      "code": "invalid_type"
    },
    {
      "field": "limit",
      "message": "Number must be less than or equal to 100",
      "code": "too_big"
    }
  ],
  "timestamp": "2025-08-08T01:22:19.918Z"
}
```

## API Documentation

### Access Points
- **Swagger UI**: http://localhost:3002/api/docs
- **OpenAPI JSON**: http://localhost:3002/api/docs.json
- **Root Endpoint**: http://localhost:3002/ (shows all available endpoints)

### OpenAPI Export
```bash
# Export OpenAPI specification to file
npm run export-openapi

# Export to custom location
npm run export-openapi ./custom/path/api-spec.json
```

## Common Validation Schemas

### Built-in Utilities
```typescript
import { CommonSchemas } from '../core/validation';

// Pagination
CommonSchemas.pagination  // { page, limit }

// Date ranges
CommonSchemas.dateRange   // { startDate?, endDate? }

// Sorting
CommonSchemas.sort        // { sortBy?, sortOrder }

// Search
CommonSchemas.search      // { q? }

// Basic types
CommonSchemas.id          // Positive integer
CommonSchemas.uuid        // UUID string
CommonSchemas.email       // Email string
CommonSchemas.url         // URL string
```

### Response Wrappers
```typescript
import { createApiResponse, createPaginatedResponse } from '../core/validation';

// Success response
const UserResponseSchema = createApiResponse(UserSchema);

// Paginated response
const UsersListSchema = createPaginatedResponse(UserSchema);
```

## Extending Validation

### Adding New Module Validation

1. **Create DTO file** (`feature/module.dto.ts`):
```typescript
import { z } from 'zod';
import { createApiResponse } from '../../core/validation';

export const ModuleSchema = z.object({
  // Define your schema
});

export const CreateModuleSchema = z.object({
  // Define creation schema
});

export const ModuleResponseSchema = createApiResponse(ModuleSchema);

export type ModuleDto = z.infer<typeof ModuleSchema>;
export type CreateModuleDto = z.infer<typeof CreateModuleSchema>;
```

2. **Create Swagger documentation** (`feature/module.swagger.ts`):
```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     Module:
 *       type: object
 *       properties:
 *         # Define properties
 */
```

3. **Apply validation in controller**:
```typescript
import { validateBody, validateQuery, validateParams } from '../../core/validation';
import { CreateModuleSchema, ModuleQuerySchema, ModuleParamsSchema } from './module.dto';
import './module.swagger';

// Apply to routes
this.router.post('/', 
  validateBody(CreateModuleSchema),
  asyncHandler(this.createModule.bind(this))
);
```

## Benefits

1. **Type Safety**: Full TypeScript support with inferred types from Zod schemas
2. **Runtime Validation**: Comprehensive request validation with detailed error messages
3. **Automatic Documentation**: OpenAPI spec generation from schemas and JSDoc comments
4. **Consistent API**: Standardized request/response formats across all endpoints
5. **Developer Experience**: Clear validation errors and comprehensive API documentation
6. **Scalable Architecture**: Easy to add new modules with consistent validation patterns
7. **Production Ready**: Robust error handling and logging integration

## Testing Validation

All validation examples shown above demonstrate the system working in real-time with the running server. The validation system provides:

- Detailed error messages for development
- Structured error responses for API consumers
- Type safety at compile time
- Runtime validation for all requests
- Comprehensive API documentation
- Easy extensibility for new features
