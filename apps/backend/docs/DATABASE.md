# Database Integration Documentation

This document explains how to set up and use the PostgreSQL database with Prisma ORM in our backend application.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Prisma Schema](#prisma-schema)
6. [Database Operations](#database-operations)
7. [User Module Integration](#user-module-integration)
8. [Repository Pattern](#repository-pattern)
9. [Validation Integration](#validation-integration)
10. [API Documentation](#api-documentation)
11. [Development Workflow](#development-workflow)
12. [Troubleshooting](#troubleshooting)

## Overview

Our backend application uses:
- **PostgreSQL** as the primary database
- **Prisma ORM** for database operations and type safety
- **Zod** for runtime validation integrated with database schemas
- **Repository pattern** for clean data access layer
- **Swagger** for API documentation with database models

## Prerequisites

1. **PostgreSQL** installed and running
2. **Node.js** (v18 or higher)
3. **npm** or **yarn** package manager

### Installing PostgreSQL

#### macOS (using Homebrew)
```bash
brew install postgresql
brew services start postgresql
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Windows
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

## Database Setup

### 1. Create Database
```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Create database
CREATE DATABASE turborepo_db;

# Create user (optional)
CREATE USER turborepo_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE turborepo_db TO turborepo_user;
```

### 2. Environment Configuration

Create or update your `.env` file:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/turborepo_db?schema=public"

# Example configurations:
# Local with default postgres user:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/turborepo_dev?schema=public"

# Local with custom user:
# DATABASE_URL="postgresql://turborepo_user:your_password@localhost:5432/turborepo_db?schema=public"

# Production (example):
# DATABASE_URL="postgresql://user:password@prod-server:5432/turborepo_prod?schema=public"
```

## Prisma Schema

Our Prisma schema (`prisma/schema.prisma`) defines the following models:

### User Model
```prisma
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  username    String?  @unique
  firstName   String?
  lastName    String?
  displayName String?
  avatar      String?
  bio         String?
  
  // Authentication fields
  password    String?
  isVerified  Boolean  @default(false)
  isActive    Boolean  @default(true)
  
  // OAuth fields
  googleId    String?  @unique
  githubId    String?  @unique
  
  // Metadata
  lastLoginAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  profiles    UserProfile[]
  posts       Post[]
  comments    Comment[]
  
  @@map("users")
}
```

### Related Models
- **UserProfile**: OAuth provider data
- **Post**: User-generated content
- **Comment**: Post comments with threading support

## Database Operations

### Available Scripts

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes to database (development)
npm run db:push

# Create and apply migrations
npm run db:migrate

# Deploy migrations (production)
npm run db:deploy

# Reset database (development only)
npm run db:reset

# Check migration status
npm run db:status

# Open Prisma Studio (database GUI)
npm run db:studio

# Seed database with sample data
npm run db:seed
```

### Migration Workflow

1. **Make schema changes** in `prisma/schema.prisma`
2. **Generate migration**: `npm run db:migrate`
3. **Apply to database**: Automatically applied during migration
4. **Update client**: `npm run db:generate`

Example:
```bash
# After modifying schema.prisma
npm run db:migrate --name add_user_avatar_field
npm run db:generate
```

## User Module Integration

### Service Layer Integration

The `UserService` now integrates with Prisma:

```typescript
// Create user with password hashing
const user = await this.userService.createUser({
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'SecurePassword123!'
});

// Get users with pagination and filters
const users = await this.userService.getAllUsers({
  page: 1,
  limit: 10,
  search: 'john',
  isActive: true
});

// Authenticate user
const authenticatedUser = await this.userService.authenticateUser({
  email: 'user@example.com',
  password: 'SecurePassword123!'
});
```

### Updated DTOs

DTOs now match the Prisma schema:

```typescript
// User creation
export const CreateUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30).optional(),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).optional(),
  // ... other fields
});

// User query with database-specific filters
export const UserQuerySchema = z.object({
  page: z.string().transform(val => parseInt(val, 10)).pipe(z.number().int().min(1)).default('1'),
  limit: z.string().transform(val => parseInt(val, 10)).pipe(z.number().int().min(1).max(100)).default('10'),
  search: z.string().optional(),
  isActive: z.string().transform(val => val === 'true').pipe(z.boolean()).optional(),
  isVerified: z.string().transform(val => val === 'true').pipe(z.boolean()).optional(),
});
```

## Repository Pattern

### UserRepository

Clean data access layer with comprehensive methods:

```typescript
// Create user
const user = await UserRepository.create({
  email: 'user@example.com',
  firstName: 'John',
  password: hashedPassword
});

// Find with relationships
const userWithPosts = await UserRepository.findById(userId, {
  include: {
    posts: true,
    comments: true
  }
});

// Paginated search
const result = await UserRepository.findMany(
  { search: 'john', isActive: true },
  { page: 1, limit: 10 }
);

// Check existence
const emailExists = await UserRepository.emailExists('user@example.com');
```

### Repository Methods

- `create(data, options?)` - Create new user
- `findById(id, options?)` - Find by ID
- `findByEmail(email, options?)` - Find by email
- `findByUsername(username, options?)` - Find by username
- `findByProviderId(provider, id, options?)` - Find by OAuth provider
- `update(id, data, options?)` - Update user
- `delete(id)` - Delete user
- `findMany(filters, pagination, options?)` - Paginated search
- `emailExists(email, excludeId?)` - Check email existence
- `usernameExists(username, excludeId?)` - Check username existence
- `updateLastLogin(id)` - Update last login timestamp

## Validation Integration

### Request Validation

Zod schemas validate incoming requests:

```typescript
// Route with validation
router.post('/users',
  validateBody(CreateUserSchema),
  asyncHandler(createUser)
);

// Validated data is available in req.validated
const userData = req.validated.body as CreateUserDto;
```

### Database Validation

Prisma provides database-level validation:
- Unique constraints (email, username)
- Required fields
- Data types
- Foreign key constraints

## API Documentation

### Swagger Integration

All endpoints are documented with Swagger:

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
 *             $ref: '#/components/schemas/CreateUserDto'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 */
```

### Available Endpoints

- `GET /api/users` - List users with pagination
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats` - User statistics
- `GET /api/health` - Health check (includes database status)

## Development Workflow

### 1. Setting Up New Development Environment

```bash
# Clone repository
git clone <repository-url>
cd setup-turborepo/apps/backend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed

# Start development server
npm run dev
```

### 2. Making Schema Changes

```bash
# 1. Edit prisma/schema.prisma
# 2. Create migration
npm run db:migrate --name descriptive_migration_name

# 3. Update seed file if needed
# Edit prisma/seed.ts

# 4. Test with fresh database
npm run db:reset
npm run db:seed
```

### 3. Adding New Models

1. **Add model to schema**:
```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Decimal
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("products")
}
```

2. **Create migration**:
```bash
npm run db:migrate --name add_product_model
```

3. **Create repository**:
```typescript
// src/core/repositories/product.repository.ts
export class ProductRepository {
  static async create(data: CreateProductInput) {
    return await prisma.product.create({ data });
  }
  // ... other methods
}
```

4. **Create DTOs**:
```typescript
// src/features/products/product.dto.ts
export const CreateProductSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  price: z.number().positive(),
});
```

5. **Create service and controller**
6. **Update Swagger documentation**

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors

```bash
# Check if PostgreSQL is running
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql      # Linux

# Test connection
psql -U postgres -h localhost -p 5432
```

#### 2. Migration Errors

```bash
# Check migration status
npm run db:status

# Reset if needed (development only)
npm run db:reset

# Manual migration
npx prisma migrate resolve --rolled-back "migration_name"
```

#### 3. Prisma Client Not Generated

```bash
# Regenerate client
npm run db:generate

# Clear node_modules if needed
rm -rf node_modules package-lock.json
npm install
npm run db:generate
```

#### 4. Type Errors

```bash
# Ensure client is up to date
npm run db:generate

# Check TypeScript compilation
npm run type-check
```

### Environment-Specific Issues

#### Development
- Use `db:push` for quick schema iterations
- Use `db:reset` to start fresh
- Enable query logging in Prisma client

#### Production
- Always use migrations (`db:deploy`)
- Never use `db:reset`
- Backup database before deployments
- Use connection pooling

### Performance Optimization

1. **Indexing**: Add database indexes for frequently queried fields
2. **Pagination**: Always use pagination for list endpoints
3. **Select fields**: Use Prisma's `select` to fetch only needed fields
4. **Connection pooling**: Configure for production environments
5. **Query optimization**: Use Prisma's query analysis tools

### Security Considerations

1. **Environment variables**: Never commit database credentials
2. **Password hashing**: Always hash passwords (using bcrypt)
3. **Input validation**: Validate all inputs with Zod
4. **SQL injection**: Prisma prevents this automatically
5. **Access control**: Implement proper authorization
6. **Database access**: Restrict database user permissions

## Next Steps

1. **Authentication**: Add JWT token management
2. **Authorization**: Implement role-based access control
3. **Caching**: Add Redis for performance
4. **File uploads**: Integrate with cloud storage
5. **Email**: Add email verification and notifications
6. **Testing**: Add integration tests with test database
7. **Monitoring**: Add database performance monitoring

For more information, refer to:
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Zod Documentation](https://zod.dev)
