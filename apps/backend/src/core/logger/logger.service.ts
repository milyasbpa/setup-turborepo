import { logger } from './winston';

export class LoggerService {
  /**
   * Log an error message
   */
  static error(message: string, meta?: any): void {
    logger.error(message, meta);
  }

  /**
   * Log a warning message
   */
  static warn(message: string, meta?: any): void {
    logger.warn(message, meta);
  }

  /**
   * Log an info message
   */
  static info(message: string, meta?: any): void {
    logger.info(message, meta);
  }

  /**
   * Log HTTP requests
   */
  static http(message: string, meta?: any): void {
    logger.http(message, meta);
  }

  /**
   * Log debug information
   */
  static debug(message: string, meta?: any): void {
    logger.debug(message, meta);
  }

  /**
   * Log request information
   */
  static logRequest(method: string, url: string, statusCode?: number, responseTime?: number): void {
    const message = `${method} ${url}${statusCode ? ` - ${statusCode}` : ''}${
      responseTime ? ` - ${responseTime}ms` : ''
    }`;
    this.http(message);
  }

  /**
   * Log error with stack trace
   */
  static logError(error: Error, context?: string): void {
    const message = context ? `[${context}] ${error.message}` : error.message;
    this.error(message, {
      stack: error.stack,
      name: error.name,
    });
  }

  /**
   * Log service operation
   */
  static logService(service: string, operation: string, success: boolean, meta?: any): void {
    const message = `[${service}] ${operation} - ${success ? 'SUCCESS' : 'FAILED'}`;
    if (success) {
      this.info(message, meta);
    } else {
      this.error(message, meta);
    }
  }

  /**
   * Log database operation
   */
  static logDatabase(operation: string, table?: string, duration?: number): void {
    const message = `DB: ${operation}${table ? ` on ${table}` : ''}${
      duration ? ` (${duration}ms)` : ''
    }`;
    this.debug(message);
  }

  /**
   * Log authentication events
   */
  static logAuth(event: string, userId?: string | number, success: boolean = true): void {
    const message = `AUTH: ${event}${userId ? ` for user ${userId}` : ''} - ${
      success ? 'SUCCESS' : 'FAILED'
    }`;
    if (success) {
      this.info(message);
    } else {
      this.warn(message);
    }
  }
}
