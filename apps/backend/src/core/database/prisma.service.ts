import { PrismaClient, Prisma } from '@prisma/client';
import { LoggerService } from '../logger/logger.service';

/**
 * Prisma Database Service
 * Manages database connection and provides centralized access to Prisma client
 */
class PrismaService {
  private static instance: PrismaService;
  private prismaClient: PrismaClient;

  private constructor() {
    this.prismaClient = new PrismaClient({
      log: [
        { level: 'query', emit: 'stdout' },
        { level: 'info', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
        { level: 'error', emit: 'stdout' },
      ],
      errorFormat: 'pretty',
    });

    this.setupEventListeners();
  }

  /**
   * Get singleton instance of PrismaService
   */
  public static getInstance(): PrismaService {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaService();
    }
    return PrismaService.instance;
  }

  /**
   * Get Prisma client instance
   */
  public getClient(): PrismaClient {
    return this.prismaClient;
  }

  /**
   * Connect to database
   */
  public async connect(): Promise<void> {
    try {
      await this.prismaClient.$connect();
      LoggerService.info('📊 Database connected successfully');
    } catch (error) {
      LoggerService.error('Failed to connect to database', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Disconnect from database
   */
  public async disconnect(): Promise<void> {
    try {
      await this.prismaClient.$disconnect();
      LoggerService.info('📊 Database disconnected successfully');
    } catch (error) {
      LoggerService.error('Failed to disconnect from database', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Health check for database connection
   */
  public async healthCheck(): Promise<boolean> {
    try {
      await this.prismaClient.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      LoggerService.error('Database health check failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  /**
   * Setup event listeners for logging
   */
  private setupEventListeners(): void {
    // For development, we can add custom logging here
    if (process.env.NODE_ENV === 'development') {
      LoggerService.debug('Database client initialized with logging enabled');
    }
  }

  /**
   * Execute database transaction
   */
  public async transaction<T>(
    fn: (prisma: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>
  ): Promise<T> {
    return this.prismaClient.$transaction(fn);
  }

  /**
   * Reset database (development only)
   */
  public async reset(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Database reset is not allowed in production');
    }

    try {
      // Note: This requires prisma migrate reset command
      LoggerService.warn('Database reset initiated');
    } catch (error) {
      LoggerService.error('Database reset failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }
}

// Export singleton instance
export const prismaService = PrismaService.getInstance();
export const prisma = prismaService.getClient();
export { PrismaService };
