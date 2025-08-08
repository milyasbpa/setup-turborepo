# Math Learning App - API Documentation

Complete API reference for the Duolingo-style math learning application backend.

## 🔗 Base URL

- **Development**: `http://localhost:3002`
- **Swagger UI**: `http://localhost:3002/api/docs`
- **OpenAPI JSON**: `http://localhost:3002/api/docs.json`

## 📚 API Endpoints Overview

### Health & Status
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Welcome message and server info |
| `GET` | `/api/health` | Health check for monitoring |

### 🎓 Lessons Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/lessons` | Get all lessons with optional user progress |
| `GET` | `/api/lessons/stats` | Get lesson statistics and counts |
| `GET` | `/api/lessons/:id` | Get specific lesson with problems (no answers) |
| `POST` | `/api/lessons/:id/submit` | Submit lesson answers (idempotent) |

### 👤 User Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/profile` | Get user profile with XP, streak, and stats |

---

## 🎓 Lessons API

### GET /api/lessons
Get all active math lessons with optional user progress.

**Query Parameters:**
- `userId` (optional): Include progress for specific user (defaults to user ID 1)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "lesson-1",
      "title": "Basic Arithmetic",
      "description": "Learn addition and subtraction basics",
      "difficulty": "BEGINNER",
      "xpReward": 10,
      "order": 1,
      "isActive": true,
      "createdAt": "2025-08-08T12:00:00.000Z",
      "updatedAt": "2025-08-08T12:00:00.000Z",
      "progress": {
        "isCompleted": false,
        "score": 0,
        "bestScore": 0,
        "attemptsCount": 0
      }
    }
  ],
  "timestamp": "2025-08-08T12:30:00.000Z"
}
```

### GET /api/lessons/stats
Get overall lesson statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalLessons": 3,
    "activeLessons": 3
  },
  "timestamp": "2025-08-08T12:30:00.000Z"
}
```

### GET /api/lessons/:id
Get specific lesson with problems (answers hidden for student view).

**Parameters:**
- `id`: Lesson ID (e.g., "lesson-1")

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "lesson-1",
    "title": "Basic Arithmetic",
    "description": "Learn addition and subtraction basics",
    "difficulty": "BEGINNER",
    "xpReward": 10,
    "order": 1,
    "isActive": true,
    "createdAt": "2025-08-08T12:00:00.000Z",
    "updatedAt": "2025-08-08T12:00:00.000Z",
    "problems": [
      {
        "id": "problem-1-1",
        "question": "What is 5 + 3?",
        "problemType": "MULTIPLE_CHOICE",
        "order": 1,
        "difficulty": "BEGINNER",
        "options": [
          {
            "id": "option-1-1-1",
            "optionText": "7",
            "order": 1
          },
          {
            "id": "option-1-1-2", 
            "optionText": "8",
            "order": 2
          },
          {
            "id": "option-1-1-3",
            "optionText": "9",
            "order": 3
          },
          {
            "id": "option-1-1-4",
            "optionText": "10",
            "order": 4
          }
        ]
      }
    ]
  },
  "timestamp": "2025-08-08T12:30:00.000Z"
}
```

### POST /api/lessons/:id/submit
Submit answers for a lesson (idempotent with attempt tracking).

**Parameters:**
- `id`: Lesson ID (e.g., "lesson-1")

**Request Body:**
```json
{
  "attemptId": "attempt-uuid-123",
  "answers": [
    {
      "problemId": "problem-1-1",
      "answer": "8"
    },
    {
      "problemId": "problem-1-2", 
      "answer": "5"
    },
    {
      "problemId": "problem-1-3",
      "answer": "15"
    },
    {
      "problemId": "problem-1-4",
      "answer": "12"
    }
  ]
}
```

**Response (New Submission):**
```json
{
  "success": true,
  "data": {
    "score": 75,
    "totalProblems": 4,
    "correctAnswers": 3,
    "isCompleted": true,
    "xpGained": 40,
    "streakUpdated": true,
    "currentXp": 40,
    "currentStreak": 1,
    "breakdown": [
      {
        "problemId": "problem-1-1",
        "isCorrect": true,
        "userAnswer": "8",
        "correctAnswer": "8",
        "explanation": "5 + 3 equals 8"
      },
      {
        "problemId": "problem-1-2",
        "isCorrect": true, 
        "userAnswer": "5",
        "correctAnswer": "5",
        "explanation": "10 - 5 equals 5"
      },
      {
        "problemId": "problem-1-3",
        "isCorrect": true,
        "userAnswer": "15",
        "correctAnswer": "15", 
        "explanation": "3 × 5 equals 15"
      },
      {
        "problemId": "problem-1-4",
        "isCorrect": false,
        "userAnswer": "12",
        "correctAnswer": "10",
        "explanation": "20 ÷ 2 equals 10"
      }
    ]
  },
  "timestamp": "2025-08-08T12:30:00.000Z"
}
```

**Response (Duplicate Submission):**
```json
{
  "success": true,
  "data": {
    "score": 75,
    "totalProblems": 4,
    "correctAnswers": 3,
    "isCompleted": true,
    "xpGained": 0,
    "streakUpdated": false,
    "currentXp": 40,
    "currentStreak": 1,
    "message": "Answers already submitted for this attempt"
  },
  "timestamp": "2025-08-08T12:30:00.000Z"
}
```

---

## 👤 Profile API

### GET /api/profile
Get user profile with XP, streak, and learning statistics.

**Query Parameters:**
- `userId` (optional): User ID to get profile for (defaults to user ID 1)

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "email": "demo@mathapp.com",
      "username": "demo_user",
      "xp": 85,
      "currentStreak": 3,
      "lastActiveDate": "2025-08-08",
      "createdAt": "2025-08-08T10:00:00.000Z"
    },
    "stats": {
      "totalSubmissions": 5,
      "completedLessons": 2,
      "averageScore": 82.5,
      "totalXpEarned": 85,
      "currentStreak": 3,
      "longestStreak": 5
    }
  },
  "timestamp": "2025-08-08T12:30:00.000Z"
}
```

---

## 🎯 XP and Streak System

### XP Calculation
- **10 XP per correct answer**
- **Lesson completion bonus**: Base lesson XP reward
- **Example**: 4 problems, 3 correct = (3 × 10) + lesson bonus

### Streak Logic
- **Increments**: When user completes lesson on different UTC day
- **Maintains**: Multiple lessons same day don't change streak
- **Resets**: When user skips a day
- **Storage**: `lastActiveDate` tracks last activity for comparison

### Idempotency
- **Attempt ID**: Prevents double XP for same submission
- **Database Constraint**: Unique constraint on `(lessonId, userId, attemptId)`
- **Behavior**: Returns previous results if attempt already exists

---

## 🔧 Validation Schemas

All endpoints use Zod validation. Key schemas:

### Lesson Submission
```typescript
{
  attemptId: string (UUID format),
  answers: Array<{
    problemId: string,
    answer: string
  }>
}
```

### Query Parameters
```typescript
{
  userId?: string (optional, defaults to "1")
}
```

---

## 🚨 Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "attemptId",
      "message": "Required",
      "code": "invalid_type"
    }
  ],
  "timestamp": "2025-08-08T12:30:00.000Z"
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": "Lesson not found",
  "timestamp": "2025-08-08T12:30:00.000Z"
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Internal server error",
  "timestamp": "2025-08-08T12:30:00.000Z"
}
```

---

## 🧪 Testing Examples

### Using curl

```bash
# Get all lessons
curl http://localhost:3002/api/lessons

# Get specific lesson
curl http://localhost:3002/api/lessons/lesson-1

# Submit answers
curl -X POST http://localhost:3002/api/lessons/lesson-1/submit \
  -H "Content-Type: application/json" \
  -d '{
    "attemptId": "test-attempt-123",
    "answers": [
      {"problemId": "problem-1-1", "answer": "8"},
      {"problemId": "problem-1-2", "answer": "5"},
      {"problemId": "problem-1-3", "answer": "15"},
      {"problemId": "problem-1-4", "answer": "10"}
    ]
  }'

# Get user profile  
curl http://localhost:3002/api/profile
```

### Using JavaScript fetch

```javascript
// Submit lesson answers
const response = await fetch('http://localhost:3002/api/lessons/lesson-1/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    attemptId: crypto.randomUUID(),
    answers: [
      { problemId: 'problem-1-1', answer: '8' },
      { problemId: 'problem-1-2', answer: '5' }
    ]
  })
});

const result = await response.json();
console.log(result);
```

---

## 📊 Database Schema

For detailed database schema information, see:
- [DATABASE_SCRIPTS.md](./DATABASE_SCRIPTS.md) - Database management
- [prisma/schema.prisma](./prisma/schema.prisma) - Complete schema
- [docs/DATABASE.md](./docs/DATABASE.md) - Database documentation

---

## 🔗 Additional Resources

- **Swagger UI**: http://localhost:3002/api/docs (Interactive API testing)
- **Health Check**: http://localhost:3002/api/health (Service status)
- **OpenAPI Spec**: http://localhost:3002/api/docs.json (Machine-readable API spec)
