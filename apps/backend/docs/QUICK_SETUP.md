# Quick Database Setup Guide

This is a quick reference for setting up the database integration.

## Prerequisites

✅ PostgreSQL installed and running  
✅ Database created  
✅ Environment variables configured  

## Setup Steps

### 1. Install Dependencies
```bash
npm install prisma @prisma/client bcrypt @types/bcrypt
```

### 2. Configure Environment
```bash
# .env
DATABASE_URL="postgresql://username:password@localhost:5432/turborepo_db?schema=public"
```

### 3. Generate Prisma Client
```bash
npm run db:generate
```

### 4. Run Migrations
```bash
npm run db:migrate
```

### 5. Seed Database (Optional)
```bash
npm run db:seed
```

### 6. Start Application
```bash
npm run dev
```

## Quick Test

Visit: `http://localhost:3002/api/health`

Should show:
```json
{
  "status": "OK",
  "checks": {
    "database": {
      "status": "healthy",
      "message": "Database connection is working"
    }
  }
}
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Create and apply migration |
| `npm run db:push` | Push schema to database |
| `npm run db:reset` | Reset database (dev only) |
| `npm run db:studio` | Open database GUI |
| `npm run db:seed` | Seed with sample data |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |
| GET | `/api/health` | Health check |
| GET | `/api/docs` | API documentation |

## Sample User Creation

```bash
curl -X POST http://localhost:3002/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "password": "Password123!"
  }'
```

## Troubleshooting

❌ **Database connection failed**  
→ Check PostgreSQL is running and DATABASE_URL is correct

❌ **Prisma client not found**  
→ Run `npm run db:generate`

❌ **Migration failed**  
→ Check database permissions and run `npm run db:status`

For detailed documentation, see [DATABASE.md](./DATABASE.md)
