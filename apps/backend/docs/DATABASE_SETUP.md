# Database Setup and Testing Guide

This guide will help you set up PostgreSQL and test the Prisma integration with actual database operations.

## 🚀 Quick Setup for Local Development

### Option 1: Using Local PostgreSQL

#### Step 1: Install PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Windows:**
Download from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)

#### Step 2: Create Database and User

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE turborepo_dev;

# Create user (optional, or use postgres user)
CREATE USER turborepo_user WITH PASSWORD 'turborepo_pass';
GRANT ALL PRIVILEGES ON DATABASE turborepo_dev TO turborepo_user;

# Exit PostgreSQL
\q
```

#### Step 3: Update .env File

```env
PORT=3002
NODE_ENV=development

# Using postgres user (simpler for development)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/turborepo_dev?schema=public"

# Or using custom user
# DATABASE_URL="postgresql://turborepo_user:turborepo_pass@localhost:5432/turborepo_dev?schema=public"
```

### Option 2: Using Docker (Recommended for Development)

Create a `docker-compose.yml` file in the backend directory:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: turborepo_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 30s
      timeout: 10s
      retries: 5

volumes:
  postgres_data:
```

Then run:
```bash
# Start PostgreSQL container
docker-compose up -d

# Update .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/turborepo_dev?schema=public"
```

### Option 3: Using Supabase (Free Cloud Option)

1. Go to [https://supabase.com](https://supabase.com)
2. Create free account and new project
3. Go to Settings > Database
4. Copy the connection string
5. Update .env:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres?schema=public"
```

## 🧪 Testing the Setup

### Step 1: Test Database Connection
```bash
npm run db:test
```

Should output:
```
✅ Database connection successful!
```

### Step 2: Run Database Migrations
```bash
npm run db:migrate
```

### Step 3: Generate Prisma Client
```bash
npm run db:generate
```

### Step 4: Run Seeders
```bash
# Test with a single seeder first
npm run db:seed:list

# Run all seeders
npm run db:seed

# Or run specific seeder
npm run db:seed UserSeeder
```

### Step 5: Verify Data
```bash
# Open Prisma Studio to view data
npm run db:studio
```

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run db:test` | Test database connection |
| `npm run db:migrate` | Create and apply migrations |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:seed` | Run all seeders |
| `npm run db:seed:list` | List available seeders |
| `npm run db:seed:rollback` | Rollback all seeders |
| `npm run db:studio` | Open database GUI |
| `npm run db:push` | Push schema changes (dev only) |
| `npm run db:reset` | Reset database (dev only) |

## 🔍 Troubleshooting

### Connection Issues

**Error: "User was denied access"**
- Check if PostgreSQL is running
- Verify username/password in DATABASE_URL
- Ensure database exists

**Error: "database does not exist"**
- Create the database using `CREATE DATABASE turborepo_dev;`

**Error: "Connection refused"**
- PostgreSQL might not be running
- Check if port 5432 is available
- Verify host address

### Migration Issues

**Error: "Migration failed"**
- Check database permissions
- Ensure no other connections are using the database
- Try `npm run db:reset` (development only)

### Seeding Issues

**Error: "Seeder failed"**
- Check database connection first: `npm run db:test`
- Ensure migrations are applied: `npm run db:migrate`
- Check console output for specific errors

## 🎯 Testing Prisma Integration

### 1. Basic Connection Test
```bash
npm run db:test
```

### 2. Create Sample Data
```bash
npm run db:seed
```

### 3. Start the Application
```bash
npm run dev
```

### 4. Test API Endpoints

**Health Check (includes database status):**
```bash
curl http://localhost:3002/api/health
```

**List Users:**
```bash
curl http://localhost:3002/api/users
```

**Create User:**
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

**Get User by ID:**
```bash
curl http://localhost:3002/api/users/[USER_ID]
```

### 5. Verify in Database
```bash
# Open Prisma Studio
npm run db:studio

# Or connect directly
psql postgresql://postgres:postgres@localhost:5432/turborepo_dev
```

## 📊 Sample Test Flow

```bash
# 1. Setup database
npm run db:test           # Should show ✅ success

# 2. Apply schema
npm run db:migrate        # Creates tables

# 3. Seed data
npm run db:seed           # Creates sample users

# 4. Start app
npm run dev               # Starts server

# 5. Test API (in another terminal)
curl http://localhost:3002/api/health
curl http://localhost:3002/api/users

# 6. View data
npm run db:studio         # Opens database GUI
```

## 🔧 Development Workflow

1. **Make schema changes** in `prisma/schema.prisma`
2. **Create migration**: `npm run db:migrate`
3. **Update seeders** if needed
4. **Test changes**: `npm run db:seed`
5. **Start development**: `npm run dev`

## 🚨 Important Notes

- Never run `db:reset` or `db:seed:rollback` in production
- Always backup production databases before migrations
- Use environment-specific DATABASE_URLs
- Keep your `.env` file private and never commit it

## 📞 Need Help?

If you encounter issues:
1. Check the console output for specific error messages
2. Verify your DATABASE_URL is correct
3. Ensure PostgreSQL is running and accessible
4. Check database permissions
5. Try the troubleshooting steps above

For more detailed information, see [DATABASE.md](./DATABASE.md)
