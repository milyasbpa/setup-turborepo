import express, { Application as ExpressApplication } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import { errorHandler, notFoundHandler } from './core/middleware';
import { HealthModule } from './features/health';
import { UserModule } from './features/users';

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
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security and CORS
    this.app.use(helmet());
    this.app.use(cors());

    // Body parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging in development
    if (process.env.NODE_ENV === 'development') {
      this.app.use((req, res, next) => {
        console.log(`📝 ${req.method} ${req.path} - ${new Date().toISOString()}`);
        next();
      });
    }
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
        },
      });
    });

    // Feature routes
    this.app.use('/api/health', this.healthModule.initialize());
    this.app.use('/api/users', this.userModule.initialize());
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 Backend server is running on port ${this.port}`);
      console.log(`📍 API available at http://localhost:${this.port}`);
      console.log(`🏥 Health check: http://localhost:${this.port}/api/health`);
      console.log(`👥 Users API: http://localhost:${this.port}/api/users`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  }

  public getApp(): ExpressApplication {
    return this.app;
  }
}
