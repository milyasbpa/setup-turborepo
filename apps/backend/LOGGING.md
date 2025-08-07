# Winston Logging Implementation

## Overview
Professional logging system implemented using Winston and Morgan for comprehensive request and application logging.

## Features
✅ **Structured Logging**: Winston with custom levels (error, warn, info, http, debug)
✅ **HTTP Request Logging**: Morgan middleware integration with Winston
✅ **Service Logging**: Centralized LoggerService wrapper for consistent logging across modules
✅ **Environment-based Configuration**: Console logging in development, file logging in production
✅ **Colorized Console Output**: Enhanced readability with colored log levels
✅ **Log Rotation**: File transport with size limits and rotation in production

## Log Levels
- **error**: System errors and exceptions
- **warn**: Warning messages and 404s
- **info**: General application information and successful operations
- **http**: HTTP request/response logging
- **debug**: Detailed debugging information

## Usage Examples

### Service Logging
```typescript
import { LoggerService } from '../core/logger/logger.service';

// Log service operations
LoggerService.logService('UserService', 'createUser', true);

// Log errors with context
LoggerService.logError(error, 'UserController.createUser');

// Log HTTP requests
LoggerService.logRequest('GET', '/api/users', 200, 45);
```

### Direct Winston Usage
```typescript
import { logger } from '../core/logger/winston';

logger.info('Application started');
logger.error('Database connection failed', { error: err.message });
```

## Configuration

### Development Mode
- Console output with colors
- Debug level logging
- No file output

### Production Mode
- Console + file output
- Info level logging
- Log rotation (5MB, 5 files)
- Separate error.log and combined.log files

## HTTP Request Examples
Real examples from the current session:

```
2025-08-08 01:07:01:71 info: [HealthService] getHealthStatus - SUCCESS
2025-08-08 01:07:01:71 info: ::1 - - [07/Aug/2025:18:07:01 +0000] "GET /api/health HTTP/1.1" 200 212 "-" "curl/8.7.1"
2025-08-08 01:07:11:711 info: [UserService] getAllUsers - SUCCESS
2025-08-08 01:07:11:711 info: ::1 - - [07/Aug/2025:18:07:11 +0000] "GET /api/users HTTP/1.1" 200 390 "-" "curl/8.7.1"
2025-08-08 01:07:20:720 info: [UserService] createUser - SUCCESS
2025-08-08 01:07:20:720 info: ::1 - - [07/Aug/2025:18:07:20 +0000] "POST /api/users HTTP/1.1" 201 233 "-" "curl/8.7.1"
2025-08-08 01:07:29:729 warn: 404 - Route not found: GET /nonexistent
```

## File Structure
```
src/core/logger/
├── winston.ts           # Winston configuration
├── logger.service.ts    # LoggerService wrapper
└── index.ts            # Barrel exports

src/core/middleware/
├── http-logger.ts      # Morgan HTTP logging middleware
└── index.ts           # Middleware exports including HTTP logger
```

## Benefits
1. **Centralized Logging**: All logging goes through a single, consistent interface
2. **Request Tracing**: Complete HTTP request/response logging with timing
3. **Error Tracking**: Structured error logging with stack traces and context
4. **Performance Monitoring**: HTTP response times and service operation tracking
5. **Production Ready**: Automatic file rotation and appropriate log levels
6. **Development Friendly**: Colorized console output for easy debugging
