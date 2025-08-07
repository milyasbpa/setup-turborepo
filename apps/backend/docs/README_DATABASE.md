# 🗄️ Database Setup Guide

This guide will help you set up PostgreSQL with Prisma for the TurboRepo backend.

## 🚀 Quick Start (Recommended)

The fastest way to get your database up and running:

```bash
npm run db:setup
```

This script will:
- ✅ Start PostgreSQL with Docker
- ✅ Create the database and tables
- ✅ Test the connection
- ✅ Optionally seed with sample data

## 📋 Prerequisites

- [Docker](https://www.docker.com/get-started) installed and running
- Node.js and npm installed

## 🔧 Manual Setup

### 1. Environment Configuration

Copy the environment example file:
```bash
cp .env.example .env
```

The default configuration uses:
- **Database**: `turborepo_dev`
- **Username**: `postgres`
- **Password**: `postgres`
- **Port**: `5432`

### 2. Start Database

Start PostgreSQL container:
```bash
docker-compose up -d postgres
```

### 3. Initialize Database

Generate Prisma client and create tables:
```bash
npm run db:generate
npm run db:push
```

### 4. Test Connection

Verify everything is working:
```bash
npm run db:test
```

### 5. Seed Database (Optional)

Add sample data for development:
```bash
npm run db:seed
```

## 📊 Database Schema

### User Model
```prisma
model User {
  id          String    @id @default(cuid())
  email       String    @unique
  username    String?   @unique
  password    String?   // For email/password auth
  firstName   String?
  lastName    String?
  isActive    Boolean   @default(true)
  isVerified  Boolean   @default(false)
  
  // OAuth fields
  googleId    String?   @unique
  githubId    String?   @unique
  
  // Timestamps
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  lastLoginAt DateTime?
  
  // Relations
  profile     UserProfile?
  posts       Post[]
  comments    Comment[]
}
```

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm run db:setup` | **Complete setup script** |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Create and run migrations |
| `npm run db:reset` | Reset database completely |
| `npm run db:studio` | Open Prisma Studio (GUI) |
| `npm run db:seed` | Seed with sample data |
| `npm run db:test` | Test database connection |

## 🔍 Database Management

### Prisma Studio
Visual database browser:
```bash
npm run db:studio
```
Opens at: http://localhost:5555

### pgAdmin (Optional)
Web-based PostgreSQL admin:
```bash
docker-compose --profile tools up -d pgadmin
```
Access at: http://localhost:8080
- Email: `admin@example.com`
- Password: `admin`

## 🌱 Seeding System

The seeding system provides sample data for development:

### Seed Database
```bash
npm run db:seed
```

### View Available Seeders
```bash
npm run db:seed:list
```

### Rollback Seeded Data
```bash
npm run db:seed:rollback
```

### Sample Data Created

**Users** (with hashed passwords):
- john.doe@example.com / password123
- jane.smith@example.com / password123
- admin@example.com / admin123

**User Profiles** with bio and avatar data
**Sample Posts** and **Comments**

## 🔧 Troubleshooting

### Docker Issues

**Error**: "Docker is not running"
```bash
# Start Docker Desktop or Docker daemon
open -a Docker  # macOS
```

**Error**: "Port 5432 already in use"
```bash
# Stop existing PostgreSQL processes
sudo pkill postgres
# Or change port in docker-compose.yml
```

### Connection Issues

**Error**: "User was denied access"
```bash
# Reset containers and volumes
docker-compose down --volumes
npm run db:setup
```

**Error**: "Database does not exist"
```bash
# Recreate database
docker-compose down --volumes
docker-compose up -d postgres
npm run db:push
```

### Prisma Issues

**Error**: "Prisma client not generated"
```bash
npm run db:generate
```

**Error**: "Schema out of sync"
```bash
npm run db:push
```

## 🔄 Database Reset

To completely reset your database:

```bash
# Option 1: Using npm script
npm run db:reset

# Option 2: Manual reset
docker-compose down --volumes
npm run db:setup
```

## 🚧 Migration Workflow

For production-ready schema changes:

```bash
# 1. Modify schema.prisma
# 2. Create migration
npm run db:migrate

# 3. Deploy to production
npm run db:deploy
```

## 📈 Production Setup

For production deployment:

1. **Use managed PostgreSQL** (AWS RDS, Google Cloud SQL, etc.)
2. **Update DATABASE_URL** in production environment
3. **Run migrations** with `npm run db:deploy`
4. **Don't use** `db:push` in production (use migrations instead)

## 📝 Environment Variables

```bash
# Required
DATABASE_URL="postgresql://user:password@host:port/database"

# Optional
PRISMA_QUERY_ENGINE_LIBRARY=true  # Performance optimization
```

## 🔗 Useful Links

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Compose Reference](https://docs.docker.com/compose/)

---

Need help? Check the logs:
```bash
# Database logs
docker-compose logs postgres

# Application logs
npm run dev
```
