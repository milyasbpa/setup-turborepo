import { z } from 'zod';

/**
 * Base DTO interface
 */
export interface BaseDto {
  readonly __brand: unique symbol;
}

/**
 * Utility type to infer DTO type from Zod schema
 */
export type InferDto<T extends z.ZodSchema> = z.infer<T> & BaseDto;

/**
 * Request DTO wrapper
 */
export interface RequestDto<TBody = any, TQuery = any, TParams = any> {
  body: TBody;
  query: TQuery;
  params: TParams;
}

/**
 * Response DTO wrapper
 */
export interface ResponseDto<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

/**
 * Paginated response DTO
 */
export interface PaginatedResponseDto<T = any> extends ResponseDto<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Error DTO
 */
export interface ErrorDto {
  success: false;
  error: string;
  details?: Array<{
    field: string;
    message: string;
    code: string;
  }>;
  timestamp: string;
}

/**
 * Validation error DTO
 */
export interface ValidationErrorDto extends ErrorDto {
  details: Array<{
    field: string;
    message: string;
    code: string;
  }>;
}

/**
 * Utility type for creating typed controllers
 */
export type TypedRequest<TBody = any, TQuery = any, TParams = any> = {
  body: TBody;
  query: TQuery;
  params: TParams;
  validated?: {
    body?: TBody;
    query?: TQuery;
    params?: TParams;
  };
};

/**
 * Utility type for creating typed responses
 */
export type TypedResponse<T = any> = {
  status: (code: number) => TypedResponse<T>;
  json: (data: ResponseDto<T> | ErrorDto) => void;
};
