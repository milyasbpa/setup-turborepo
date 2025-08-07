import { prisma } from '../database';
import { LoggerService } from '../logger/logger.service';

/**
 * Base seeder interface
 */
export interface ISeeder {
  name: string;
  run(): Promise<void>;
  rollback?(): Promise<void>;
}

/**
 * Seeder manager for running database seeders
 */
export class SeederManager {
  private seeders: ISeeder[] = [];

  /**
   * Register a seeder
   */
  register(seeder: ISeeder): void {
    this.seeders.push(seeder);
    LoggerService.debug(`Registered seeder: ${seeder.name}`);
  }

  /**
   * Run all registered seeders
   */
  async runAll(): Promise<void> {
    LoggerService.info('🌱 Starting database seeding...');
    
    for (const seeder of this.seeders) {
      try {
        LoggerService.info(`🌱 Running seeder: ${seeder.name}`);
        await seeder.run();
        LoggerService.info(`✅ Completed seeder: ${seeder.name}`);
      } catch (error) {
        LoggerService.error(`❌ Failed to run seeder: ${seeder.name}`, {
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
      }
    }

    LoggerService.info('🎉 Database seeding completed successfully!');
  }

  /**
   * Run a specific seeder by name
   */
  async runSeeder(name: string): Promise<void> {
    const seeder = this.seeders.find(s => s.name === name);
    
    if (!seeder) {
      throw new Error(`Seeder '${name}' not found`);
    }

    LoggerService.info(`🌱 Running seeder: ${seeder.name}`);
    await seeder.run();
    LoggerService.info(`✅ Completed seeder: ${seeder.name}`);
  }

  /**
   * Rollback all seeders (if supported)
   */
  async rollbackAll(): Promise<void> {
    LoggerService.info('🔄 Rolling back database seeders...');
    
    // Run rollbacks in reverse order
    for (const seeder of this.seeders.reverse()) {
      if (seeder.rollback) {
        try {
          LoggerService.info(`🔄 Rolling back seeder: ${seeder.name}`);
          await seeder.rollback();
          LoggerService.info(`✅ Rolled back seeder: ${seeder.name}`);
        } catch (error) {
          LoggerService.error(`❌ Failed to rollback seeder: ${seeder.name}`, {
            error: error instanceof Error ? error.message : 'Unknown error'
          });
          throw error;
        }
      }
    }

    LoggerService.info('🎉 Database rollback completed successfully!');
  }

  /**
   * List all registered seeders
   */
  list(): string[] {
    return this.seeders.map(s => s.name);
  }

  /**
   * Check if database connection is healthy before seeding
   */
  async checkConnection(): Promise<void> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      LoggerService.info('✅ Database connection is healthy');
    } catch (error) {
      LoggerService.error('❌ Database connection failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw new Error('Database connection failed. Please check your DATABASE_URL and ensure the database is running.');
    }
  }

  /**
   * Clean up database connection
   */
  async cleanup(): Promise<void> {
    await prisma.$disconnect();
    LoggerService.info('📊 Database connection closed');
  }
}
