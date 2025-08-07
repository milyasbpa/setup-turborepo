import morgan from 'morgan';
import { LoggerService } from '../logger/logger.service';

// Create a Winston stream object for Morgan
const stream = {
  write: (message: string) => {
    LoggerService.info(message.trim());
  }
};

// HTTP request logger middleware
export const httpLogger = morgan('combined', { stream });

// Error HTTP request logger middleware
export const errorHttpLogger = morgan('combined', {
  stream,
  skip: (req, res) => res.statusCode < 400
});