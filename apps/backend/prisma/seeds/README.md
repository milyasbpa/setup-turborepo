# Math Learning App - Seeding System

This directory contains the JSON-based seeding system for the math learning app demo data.

## 📁 Directory Structure

```
seeds/
├── README.md              # This file
├── seed.ts               # Main seeding script
├── cleanup.ts            # Standalone cleanup script
├── config/
│   └── seeding.config.ts # Seeding configuration
└── data/
    ├── users.json        # Demo user data
    ├── lessons.json      # Math lessons with metadata
    ├── problems.json     # Math problems for each lesson
    └── options.json      # Multiple choice options
```

## 🚀 Available Commands

```bash
# Basic seeding
npm run db:seed                    # Seed all data
npm run db:seed:list              # List available tables
npm run db:seed table lessons     # Seed specific table

# Cleanup operations
npm run db:seed:clean             # Clean math learning data
npm run db:seed:reset             # Clean + seed in one command
npm run db:cleanup                # Standalone cleanup script
```

## 📊 Demo Data Overview

### User Data
- **1 Demo User**: `demo@mathapp.com` (ID: 1)
- Initial XP: 0, Streak: 0
- Ready for math learning progress

### Lesson Data
- **3 Math Lessons**:
  1. **Basic Arithmetic** - Addition/subtraction (4 problems, 10 XP)
  2. **Multiplication Mastery** - Times tables (4 problems, 15 XP)
  3. **Division Basics** - Division problems (4 problems, 20 XP)

### Problem Types
- **Multiple Choice**: 4 options per problem
- **Difficulty Levels**: BEGINNER to INTERMEDIATE
- **Explanations**: Included for learning reinforcement

## 🔧 Configuration

The seeding system uses `config/seeding.config.ts` for:
- Table seeding order (respects foreign key dependencies)
- Available table list for selective seeding
- Cleanup order (reverse dependency order)

## 📝 JSON Data Format

### Lessons (lessons.json)
```json
{
  "id": "lesson-1",
  "title": "Basic Arithmetic", 
  "description": "Learn addition and subtraction basics",
  "difficulty": "BEGINNER",
  "xpReward": 10,
  "order": 1,
  "isActive": true
}
```

### Problems (problems.json)
```json
{
  "id": "problem-1-1",
  "lessonId": "lesson-1",
  "question": "What is 5 + 3?",
  "correctAnswer": "8",
  "explanation": "5 + 3 = 8",
  "problemType": "MULTIPLE_CHOICE",
  "difficulty": "BEGINNER",
  "order": 1
}
```

### Options (options.json)
```json
{
  "id": "option-1-1-1",
  "problemId": "problem-1-1", 
  "optionText": "7",
  "isCorrect": false,
  "order": 1
}
```

## 🛠️ Customization

To add new demo data:
1. **Edit JSON files** in `data/` directory
2. **Follow the existing ID patterns** for consistency
3. **Maintain foreign key relationships**
4. **Run seeding**: `npm run db:seed:reset`

## 🧹 Cleanup System

The cleanup system safely removes:
- All user progress and submissions
- All problem options and problems  
- All lessons
- Resets user XP and streak to 0
- **Preserves**: User accounts and basic structure

**Safe for development**: Uses transactions to ensure data integrity.

---

For detailed database scripts documentation, see [DATABASE_SCRIPTS.md](../DATABASE_SCRIPTS.md)