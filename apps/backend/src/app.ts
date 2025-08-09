import express, { Application as ExpressApplication } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import { errorHandler, notFoundHandler, httpLogger, errorHttpLogger } from './core/middleware';
import { LoggerService } from './core/logger';
import { setupSwagger } from './core/swagger';
import { prismaService } from './core/database';
import { HealthModule } from './features/health';
import { UserModule } from './features/users';
import lessonRoutes from './features/lessons/lesson.routes';
import profileRoutes from './features/profile/profile.routes';
import recommendationRoutes from './features/recommendations/recommendation.routes';

// Load environment variables
dotenv.config();

export class Application {
  public app: ExpressApplication;
  private port: number;

  // Module instances
  private healthModule: HealthModule;
  private userModule: UserModule;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3002');

    // Initialize modules
    this.healthModule = new HealthModule();
    this.userModule = new UserModule();

    this.initializeMiddleware();
    this.initializeSwagger();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // HTTP request logging
    this.app.use(httpLogger);
    this.app.use(errorHttpLogger);

    // Security and CORS
    this.app.use(helmet());
    this.app.use(cors());

    // Body parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    LoggerService.info('Middleware initialized successfully');
  }

  private initializeSwagger(): void {
    setupSwagger(this.app);
    LoggerService.info('Swagger documentation initialized');
  }

  private initializeRoutes(): void {
    // Root route
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Backend API is running!',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
          health: '/api/health',
          users: '/api/users',
          lessons: '/api/lessons',
          profile: '/api/profile',
          recommendations: '/api/recommendations',
          docs: '/api/docs',
          openapi: '/api/docs.json',
        },
      });
    });

    // Feature routes
    this.app.use('/api/health', this.healthModule.initialize());
    this.app.use('/api/users', this.userModule.initialize());
    this.app.use('/api/lessons', lessonRoutes);
    this.app.use('/api/profile', profileRoutes);
    this.app.use('/api/recommendations', recommendationRoutes);

    LoggerService.info('Routes initialized successfully');
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }

  /**
   * Initialize database connection
   */
  private async initializeDatabase(): Promise<void> {
    try {
      await prismaService.connect();
      LoggerService.info('✅ Database connection established');
    } catch (error) {
      LoggerService.error('❌ Failed to connect to database', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      process.exit(1);
    }
  }

  /**
   * Graceful shutdown
   */
  private setupGracefulShutdown(): void {
    const gracefulShutdown = async (signal: string) => {
      LoggerService.info(`📝 Received ${signal}. Starting graceful shutdown...`);
      
      try {
        await prismaService.disconnect();
        LoggerService.info('✅ Database disconnected successfully');
        process.exit(0);
      } catch (error) {
        LoggerService.error('❌ Error during graceful shutdown', {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  }

  public async start(): Promise<void> {
    try {
      // Initialize database first
      await this.initializeDatabase();
      
      // Setup graceful shutdown
      this.setupGracefulShutdown();

      // Start the server
      this.app.listen(this.port, () => {
        LoggerService.info(`🚀 Backend server is running on port ${this.port}`);
        LoggerService.info(`📍 API available at http://localhost:${this.port}`);
        LoggerService.info(`🏥 Health check: http://localhost:${this.port}/api/health`);
        LoggerService.info(`👥 Users API: http://localhost:${this.port}/api/users`);
        LoggerService.info(`📚 Lessons API: http://localhost:${this.port}/api/lessons`);
        LoggerService.info(`👤 Profile API: http://localhost:${this.port}/api/profile`);
        LoggerService.info(`🎯 Recommendations API: http://localhost:${this.port}/api/recommendations`);
        LoggerService.info(`📊 Database: Connected to PostgreSQL`);
        LoggerService.info(`📖 API Documentation: http://localhost:${this.port}/api/docs`);
        LoggerService.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    } catch (error) {
      LoggerService.error('❌ Failed to start application', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      process.exit(1);
    }
  }

  public listen(): void {
    // Deprecated: Use start() instead
    LoggerService.warn('⚠️ listen() method is deprecated. Use start() method instead.');
    this.start();
  }

  public getApp(): ExpressApplication {
    return this.app;
  }
}
