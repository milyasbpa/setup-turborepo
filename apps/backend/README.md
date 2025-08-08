# 🧮 Math Learning App - Backend

A modern Express.js TypeScript backend with PostgreSQL, Prisma ORM, and Docker support for a Duolingo-style math learning platform.

## 🚀 Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env

# 3. Start PostgreSQL with Docker
docker-compose up -d

# 4. Setup database
npm run db:generate
npm run db:push
npm run db:seed

# 5. Start development server
npm run dev
```

✅ **Backend running at**: http://localhost:3001

## � Quick Links

| Service | URL | Description |
|---------|-----|-------------|
| 🚀 **API Server** | http://localhost:3001 | Main REST API |
| � **API Docs** | http://localhost:3001/api/docs | Swagger documentation |
| 🏥 **Health Check** | http://localhost:3001/api/health | Server status |
| 🐳 **PostgreSQL** | localhost:5432 | Database (Docker) |

## 📊 Key Features

- 🧮 **Math Learning System** - Lessons, problems, XP/streak tracking
- 🐳 **Docker Integration** - One-command PostgreSQL setup
- 📝 **TypeScript** - Full type safety
- 🗄️ **Prisma ORM** - Type-safe database operations
- 🔍 **Swagger Docs** - Interactive API documentation
- ✅ **Health Monitoring** - Database and service status checks

## 🛠️ Essential Commands

```bash
# Development
npm run dev              # Start with hot reload
npm run build            # Build for production

# Database
npm run db:push          # Push schema changes
npm run db:seed          # Add demo data
npm run db:studio        # Open database GUI

# Docker
docker-compose up -d     # Start PostgreSQL
docker-compose down      # Stop services
docker-compose logs      # View database logs
```

## 📚 Complete Documentation

For detailed information, see the **[`/docs`](./docs/)** folder:

### 🚀 Getting Started
- **[Quick Setup Guide](./docs/QUICK_SETUP.md)** - Simplified setup instructions
- **[Documentation Index](./docs/README.md)** - Complete documentation overview

### 🗄️ Database & Development
- **[Database Setup](./docs/DATABASE_SETUP.md)** - Detailed database configuration
- **[API Documentation](./docs/API_DOCUMENTATION.md)** - Complete REST API reference
- **[Database Scripts](./docs/DATABASE_SCRIPTS.md)** - Database management scripts
- **[Seeding Guide](./docs/SEEDING.md)** - Demo data management

### 🏗️ Architecture & Advanced
- **[Application Architecture](./docs/ARCHITECTURE.md)** - Project structure and patterns
- **[Logging System](./docs/LOGGING.md)** - Monitoring and debugging
- **[Input Validation](./docs/VALIDATION.md)** - Request validation with Zod

## ⚠️ Troubleshooting

**Database connection issues?**
```bash
# Check Docker status
docker-compose ps

# Restart PostgreSQL
docker-compose restart postgres

# View logs
docker-compose logs postgres
```

**Need help?** Check the [complete troubleshooting guide](./docs/QUICK_SETUP.md#troubleshooting) in the docs.

---

**Happy coding!** 🚀 For detailed documentation, explore the [`/docs`](./docs/) folder.
