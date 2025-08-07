import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { LoggerService } from '../logger/logger.service';

/**
 * Validation target enum
 */
export enum ValidationTarget {
  BODY = 'body',
  QUERY = 'query',
  PARAMS = 'params',
  HEADERS = 'headers'
}

/**
 * Validation error response interface
 */
export interface ValidationErrorResponse {
  success: false;
  error: string;
  details: Array<{
    field: string;
    message: string;
    code: string;
  }>;
  timestamp: string;
}

/**
 * Middleware factory for Zod validation
 */
export function validateRequest<TInput, TOutput>(
  schema: z.ZodSchema<TOutput, any, TInput>,
  target: ValidationTarget = ValidationTarget.BODY
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = req[target];
      
      // Parse and validate the data
      const result = schema.safeParse(dataToValidate);
      
      if (!result.success) {
        const errors = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        const errorResponse: ValidationErrorResponse = {
          success: false,
          error: 'Validation failed',
          details: errors,
          timestamp: new Date().toISOString()
        };

        LoggerService.warn(`Validation failed for ${req.method} ${req.path}`, {
          target,
          errors: errors
        });

        return res.status(400).json(errorResponse);
      }

      // Add validated data to request object
      req.validated = {
        ...(req.validated || {}),
        [target]: result.data
      };

      next();
    } catch (error) {
      LoggerService.error('Validation middleware error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        path: req.path,
        method: req.method
      });

      const errorResponse: ValidationErrorResponse = {
        success: false,
        error: 'Internal validation error',
        details: [],
        timestamp: new Date().toISOString()
      };

      return res.status(500).json(errorResponse);
    }
  };
}

/**
 * Middleware for validating request body
 */
export function validateBody<TInput, TOutput>(schema: z.ZodSchema<TOutput, any, TInput>) {
  return validateRequest(schema, ValidationTarget.BODY);
}

/**
 * Middleware for validating query parameters
 */
export function validateQuery<TInput, TOutput>(schema: z.ZodSchema<TOutput, any, TInput>) {
  return validateRequest(schema, ValidationTarget.QUERY);
}

/**
 * Middleware for validating route parameters
 */
export function validateParams<TInput, TOutput>(schema: z.ZodSchema<TOutput, any, TInput>) {
  return validateRequest(schema, ValidationTarget.PARAMS);
}

/**
 * Middleware for validating headers
 */
export function validateHeaders<TInput, TOutput>(schema: z.ZodSchema<TOutput, any, TInput>) {
  return validateRequest(schema, ValidationTarget.HEADERS);
}

// Extend Express Request interface to include validated data
declare global {
  namespace Express {
    interface Request {
      validated?: {
        body?: any;
        query?: any;
        params?: any;
        headers?: any;
      };
    }
  }
}
