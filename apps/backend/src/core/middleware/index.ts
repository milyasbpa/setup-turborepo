import { Request, Response, NextFunction } from 'express';
import { AsyncHandler, ApiResponse } from '../interfaces';

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Create standardized API response
 */
export const createResponse = <T>(
  success: boolean = true,
  data?: T,
  message?: string,
  error?: string
): ApiResponse<T> => {
  return {
    success,
    data,
    message,
    error,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Send success response
 */
export const sendSuccess = <T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200
) => {
  return res.status(statusCode).json(createResponse(true, data, message));
};

/**
 * Send error response
 */
export const sendError = (
  res: Response,
  error: string,
  statusCode: number = 500,
  data?: any
) => {
  return res.status(statusCode).json(createResponse(false, data, undefined, error));
};

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`❌ Error: ${err.message}`);
  console.error(err.stack);

  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return sendError(
    res,
    isDevelopment ? err.message : 'Internal server error',
    500,
    isDevelopment ? { stack: err.stack } : undefined
  );
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response) => {
  return sendError(
    res,
    `Route ${req.originalUrl} not found`,
    404
  );
};
