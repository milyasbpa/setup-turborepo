# 🌱 JSON-Based Database Seeding System

This document describes the scalable, JSON-based database seeding system that supports dependencies, lookups, and data transformation.

> 📖 **Related Documentation**: [DATABASE_SETUP.md](./DATABASE_SETUP.md) | [README_DATABASE.md](./README_DATABASE.md) | [DATABASE.md](./DATABASE.md)

## 📁 Structure

```
prisma/seeds/
├── seed-config.json       # Seeding configuration and order
├── json-seeder.ts         # Advanced seeder class
└── data/                  # JSON data files
    ├── users.json         # User account data
    ├── posts.json         # Blog posts and articles
    └── comments.json      # Comments on posts
```

> 💡 **Note**: This documentation is located in `docs/SEEDING.md` but describes the seeding system in `prisma/seeds/`

## 🚀 Quick Start

### Seed All Tables
```bash
npm run db:seed
# or
npx prisma db seed
```

### List Available Tables
```bash
npm run db:seed list
```

### Seed Specific Table
```bash
npm run db:seed table users
npm run db:seed table posts
npm run db:seed table comments
```

## ⚙️ Configuration

The `seed-config.json` file defines:

- **Seed Order**: Dependencies between tables
- **Field Mappings**: How to resolve foreign keys
- **Hash Fields**: Which fields to bcrypt (passwords)
- **Required Fields**: Validation rules
- **Settings**: Global seeding options

### Example Configuration

```json
{
  "seedOrder": [
    {
      "table": "users",
      "file": "users.json",
      "dependencies": [],
      "requiredFields": ["email", "password"],
      "hashFields": ["password"]
    },
    {
      "table": "posts", 
      "file": "posts.json",
      "dependencies": ["users"],
      "lookupFields": {
        "authorEmail": {
          "table": "users",
          "field": "email", 
          "maps_to": "authorId"
        }
      }
    }
  ]
}
```

## 📊 Data Format

### Users (users.json)
```json
[
  {
    "email": "admin@example.com",
    "username": "admin", 
    "firstName": "Admin",
    "lastName": "User",
    "password": "Admin123!",
    "isVerified": true,
    "isActive": true,
    "bio": "System administrator"
  }
]
```

### Posts (posts.json)
```json
[
  {
    "title": "Welcome Post",
    "content": "Welcome to our platform!",
    "slug": "welcome-post",
    "published": true,
    "authorEmail": "admin@example.com",
    "tags": ["welcome", "announcement"],
    "excerpt": "Welcome message"
  }
]
```

### Comments (comments.json)
```json
[
  {
    "content": "Great post!",
    "postSlug": "welcome-post", 
    "authorEmail": "user@example.com"
  }
]
```

## 🔧 Features

### Automatic Dependency Resolution
Tables are seeded in the correct order based on dependencies defined in the configuration.

### Foreign Key Lookup
The seeder automatically resolves foreign keys using lookup fields:
- `authorEmail` → `authorId` (User ID)
- `postSlug` → `postId` (Post ID)

### Password Hashing
Passwords are automatically hashed using bcrypt with configurable salt rounds.

### Upsert Logic
Existing records are skipped or updated based on unique fields to prevent duplicates.

### Caching System
Records are cached during seeding for efficient lookup resolution.

### Validation
Required fields are validated before creating records.

### Flexible Logging
Configurable log levels (debug, info, warn, error) for different environments.

## 📝 Adding New Data

### 1. Create JSON Data File
Create a new file in `data/` directory:

```bash
touch prisma/seeds/data/categories.json
```

### 2. Add Sample Data
```json
[
  {
    "name": "Technology",
    "slug": "technology",
    "description": "Tech-related posts"
  }
]
```

### 3. Update Configuration
Add to `seed-config.json`:

```json
{
  "table": "categories",
  "file": "categories.json", 
  "description": "Post categories",
  "dependencies": [],
  "requiredFields": ["name", "slug"]
}
```

### 4. Update Seeder Class
Add handling for the new table in `json-seeder.ts`:

```typescript
case 'categories':
  record = await (this.prisma as any).category.upsert({
    where: { slug: recordData.slug },
    update: this.config.settings.skipExisting ? {} : recordData,
    create: recordData,
  });
  this.cacheRecord('categories', record, ['slug']);
  break;
```

## 🔍 Troubleshooting

### Common Issues

**Missing Dependencies**
- Ensure all dependent tables are listed in `dependencies` array
- Check that lookup tables are seeded first

**Lookup Failures**
- Verify lookup field values exist in referenced tables
- Check for typos in email addresses or slugs

**Validation Errors**
- Ensure all `requiredFields` are present in JSON data
- Check data types match Prisma schema

**Duplicate Key Errors**
- Verify unique fields (email, username, slug) are unique across records
- Use `skipExisting: true` in settings to skip duplicates

### Debug Mode

Enable debug logging in `seed-config.json`:

```json
{
  "settings": {
    "logLevel": "debug"
  }
}
```

## 🎯 Best Practices

1. **Keep Data Realistic**: Use realistic names, emails, and content
2. **Maintain Relationships**: Ensure referenced records exist
3. **Use Meaningful IDs**: Use descriptive usernames, slugs, etc.
4. **Version Control**: Keep JSON files in version control
5. **Test Regularly**: Run seeds on clean database to test integrity
6. **Document Changes**: Update this README when adding new tables

## 🔧 Development Commands

```bash
# Test seeding on clean database
npm run db:reset
npm run db:seed

# Seed specific table for testing
npm run db:seed table users

# Check what tables are available
npm run db:seed list

# View seeded data
npm run db:studio
```

## 📈 Performance Tips

- Use `skipExisting: true` for faster re-seeding
- Keep JSON files reasonably sized (< 1000 records each)
- Use database indexing on lookup fields
- Cache records efficiently during seeding

This seeding system provides a scalable foundation for managing test data across development, staging, and testing environments.
