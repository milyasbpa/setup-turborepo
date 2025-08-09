# Lucide React Icons

This project uses [lucide-react](https://lucide.dev/guide/packages/lucide-react) for consistent, beautiful icons throughout the application.

## Installation

Lucide React is already installed in this project:

```bash
npm install lucide-react
```

## Usage

Import icons from lucide-react and use them as React components:

```tsx
import { Check, X, Clock, BookOpen, User } from 'lucide-react';

// Use in components
<Check className="w-5 h-5 text-green-600" />
<Clock className="w-4 h-4 text-blue-500" />
```

## Common Icons Used in This Project

### Navigation & UI
- `Home` - Home page
- `BookOpen` - Lessons/Learning
- `User` - Profile/User
- `Users` - Multiple users
- `Calculator` - Math/App branding
- `Menu` - Mobile menu
- `Search` - Search functionality
- `Settings` - Settings page

### Actions & States
- `Check` / `CheckCircle` - Completed/Success
- `X` / `XCircle` - Error/Failed
- `Clock` - In progress/Time
- `Play` - Start/Begin
- `Pause` - Pause
- `ArrowLeft` / `ArrowRight` - Navigation
- `ChevronRight` / `ChevronDown` - Expand/Collapse

### Math & Learning
- `Brain` - Intelligence/Learning
- `Target` - Goals/Achievements
- `Trophy` - Awards/Success
- `Star` - Favorites/Rating
- `Zap` - XP/Energy
- `Flame` - Streak

### Progress & Stats
- `TrendingUp` - Progress/Growth
- `BarChart` - Statistics
- `PieChart` - Analytics
- `Calendar` - Dates/Schedule
- `Timer` - Time tracking

## Icon Sizing

Use consistent sizing classes:
- `w-4 h-4` - Small icons (16px)
- `w-5 h-5` - Medium icons (20px)
- `w-6 h-6` - Large icons (24px)
- `w-8 h-8` - Extra large icons (32px)

## Color Classes

Use Tailwind color utilities:
- `text-green-600` - Success states
- `text-red-600` - Error states  
- `text-blue-600` - Primary actions
- `text-yellow-600` - Warning/Progress
- `text-gray-600` - Secondary/Inactive

## Examples

### Lesson Card Status
```tsx
{isCompleted ? (
  <Check className="w-4 h-4 text-green-600" />
) : isInProgress ? (
  <Clock className="w-4 h-4 text-blue-600" />
) : (
  <Play className="w-4 h-4 text-gray-400" />
)}
```

### Navigation Items
```tsx
const navigationItems = [
  { icon: BookOpen, label: 'Lessons' },
  { icon: User, label: 'Profile' },
  { icon: Settings, label: 'Settings' },
];
```

### Stats Display
```tsx
<div className="flex items-center">
  <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
  <span className="text-2xl font-bold">{completedCount}</span>
</div>
```

## Benefits of Lucide React

1. **Consistent Design** - All icons follow the same design principles
2. **Tree Shaking** - Only imports icons you actually use
3. **Accessibility** - Built-in accessibility features
4. **Customizable** - Easy to style with CSS/Tailwind
5. **React Native Support** - Same icons work across platforms
6. **Active Development** - Regularly updated with new icons

## Icon Browser

Browse all available icons at: https://lucide.dev/icons/
