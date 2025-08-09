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

### 🚀 Getting Started
- **[API Documentation](./docs/API_DOCUMENTATION.md)** - Complete REST API reference with examples

### 🗄️ Database & Development
- **[Database Documentation](./docs/DATABASE.md)** - Complete database setup, usage, and management guide
- **[Database Scripts](./docs/DATABASE_SCRIPTS.md)** - Database management scripts
- **[Seeding Guide](./docs/SEEDING.md)** - JSON-based database seeding system

### 🏗️ Architecture & Advanced
- **[Application Architecture](./docs/ARCHITECTURE.md)** - Project structure and patterns
- **[Logging System](./docs/LOGGING.md)** - Monitoring and debugging
- **[Input Validation](./docs/VALIDATION.md)** - Request validation with Zod

## 🎓 Math Learning Features

This backend implements a comprehensive Duolingo-style math learning system:

### 📚 Core Features
- **Lesson Management**: Structured math lessons with problems and solutions
- **XP System**: Experience points for correct answers and lesson completion
- **Streak Tracking**: Daily streak system with automatic reset logic
- **Progress Tracking**: User progress per lesson with completion status
- **Idempotent Submissions**: Safe answer submission with attempt tracking

### 🔧 Technical Implementation
- **Prisma ORM**: Type-safe database operations with PostgreSQL
- **Clean Architecture**: Separation of concerns with repositories, services, controllers
- **Zod Validation**: Runtime type checking for all API inputs
- **Swagger Documentation**: Complete API documentation at `/api/docs`
- **JSON Seeding**: Flexible demo data management system

## 🎯 Documentation Navigation

### For New Developers
1. Start with [Database Documentation](./docs/DATABASE.md) for complete database setup
2. Review [API Documentation](./docs/API_DOCUMENTATION.md) for API reference
3. Check [Application Architecture](./docs/ARCHITECTURE.md) for project structure

### For Database Setup
1. Follow [Database Documentation](./docs/DATABASE.md) for comprehensive database setup and usage
2. Use [Seeding Guide](./docs/SEEDING.md) for sample data management
3. Reference [Database Scripts](./docs/DATABASE_SCRIPTS.md) for script usage

### For Development
1. Check [Logging System](./docs/LOGGING.md) for debugging and monitoring
2. Review [Input Validation](./docs/VALIDATION.md) for input handling
3. Follow [Application Architecture](./docs/ARCHITECTURE.md) for code organization

## 📂 Documentation File Structure

```
docs/
├── DATABASE.md              # Complete database setup and usage guide
├── API_DOCUMENTATION.md     # Complete REST API reference
├── SEEDING.md              # JSON-based seeding system
├── DATABASE_SCRIPTS.md     # Database management scripts
├── ARCHITECTURE.md          # Application architecture
├── LOGGING.md              # Logging documentation
└── VALIDATION.md           # Validation documentation
```

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

**Need help?** Check the [complete database documentation](./docs/DATABASE.md) in the docs.

## 🔗 External Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)

## 🤝 Contributing

When adding new documentation:
1. Follow the established naming convention
2. Update this README with new file references
3. Add appropriate cross-references
4. Use clear headings and sections
5. Include code examples where relevant

---

**Happy coding!** 🚀 For detailed documentation, explore the [`/docs`](./docs/) folder.

💡 **Tip**: All documentation files use Markdown format and support syntax highlighting for code blocks.
