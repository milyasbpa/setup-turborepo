# Math Learning App - Database Scripts

This document explains the available database management scripts for the math learning app.

## Prerequisites

- PostgreSQL must be running
- Environment variables configured in `.env`
- Dependencies installed (`npm install`)

## Database Setup

### Initial Setup
```bash
# 1. Generate Prisma client
npm run db:generate

# 2. Run migrations
npm run db:migrate

# 3. Seed with demo data
npm run db:seed
```

## Seed Scripts

### Basic Seeding
```bash
# Seed all tables with demo data
npm run db:seed

# List available seed tables
npm run db:seed:list

# Seed specific table only
npm run db:seed table users
npm run db:seed table lessons
```

### Cleanup Operations
```bash
# Clean up all math learning data (keeps user accounts, resets XP/streak)
npm run db:seed:clean
# OR
npm run db:cleanup

# Reset everything (clean + seed in one command)
npm run db:seed:reset
```

## Demo Data

After seeding, you'll have:

### User
- **Demo User** (ID: 1)
  - Email: `demo@mathapp.com`
  - Username: `demo_user`
  - Initial XP: 0, Streak: 0

### Lessons
1. **Basic Arithmetic** - Addition/subtraction (4 problems, 10 XP reward)
2. **Multiplication Mastery** - Times tables (4 problems, 15 XP reward)  
3. **Division Basics** - Division problems (4 problems, 20 XP reward)

### XP System
- **10 XP per correct answer**
- **Streak Logic**: Increments on different UTC day, resets if day missed
- **Idempotency**: Same `attempt_id` prevents double XP granting

## API Endpoints

After seeding, test these endpoints:

```bash
# Get all lessons with progress
GET http://localhost:3002/api/lessons

# Get specific lesson with problems
GET http://localhost:3002/api/lessons/lesson-1

# Submit lesson answers (idempotent)
POST http://localhost:3002/api/lessons/lesson-1/submit
{
  "attemptId": "attempt-123",
  "answers": [
    {"problemId": "problem-1-1", "answer": "8"},
    {"problemId": "problem-1-2", "answer": "5"}
  ]
}

# Get user profile with stats
GET http://localhost:3002/api/profile
```

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# Check migration status
npm run db:status

# Reset database if needed
npm run db:reset
```

### Data Issues
```bash
# Clean and re-seed if data is corrupted
npm run db:seed:reset

# Or clean manually then seed
npm run db:cleanup
npm run db:seed
```

## Development Workflow

1. **Make schema changes** in `prisma/schema.prisma`
2. **Create migration**: `npm run db:migrate`
3. **Update seed data** in `prisma/seeds/data/`
4. **Test with clean data**: `npm run db:seed:reset`
5. **Verify API endpoints** work correctly
