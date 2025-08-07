import { Request, Response, NextFunction, Router } from 'express';

export interface IController {
  router: Router;
  initializeRoutes(): void;
}

export interface IService {
  // Base service interface - modules can extend this
}

export interface IModule {
  controller: IController;
  service: IService;
  initialize(): Router;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response>;

export interface ValidationError {
  field: string;
  message: string;
}
