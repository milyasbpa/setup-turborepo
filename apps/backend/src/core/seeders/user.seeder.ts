import { ISeeder } from './seeder.manager';
import { UserRepository } from '../repositories';
import { LoggerService } from '../logger/logger.service';
import * as bcrypt from 'bcrypt';

/**
 * User Seeder
 * Creates sample users for development and testing
 */
export class UserSeeder implements ISeeder {
  name = 'UserSeeder';
  private saltRounds = 12;

  async run(): Promise<void> {
    LoggerService.info('👥 Creating sample users...');

    const users = [
      {
        email: 'admin@example.com',
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        displayName: 'Administrator',
        password: await bcrypt.hash('Admin123!', this.saltRounds),
        isVerified: true,
        isActive: true,
        bio: 'System administrator with full access to the platform',
      },
      {
        email: 'john.doe@example.com',
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
        password: await bcrypt.hash('Password123!', this.saltRounds),
        isVerified: true,
        isActive: true,
        bio: 'Software developer passionate about TypeScript, Node.js, and modern web technologies',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      },
      {
        email: 'jane.smith@example.com',
        username: 'janesmith',
        firstName: 'Jane',
        lastName: 'Smith',
        displayName: 'Jane Smith',
        password: await bcrypt.hash('Password123!', this.saltRounds),
        isVerified: true,
        isActive: true,
        bio: 'UX/UI designer and frontend developer, creating beautiful and intuitive user experiences',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=150&h=150&fit=crop&crop=face',
      },
      {
        email: 'bob.wilson@example.com',
        username: 'bobwilson',
        firstName: 'Bob',
        lastName: 'Wilson',
        displayName: 'Bob Wilson',
        password: await bcrypt.hash('Password123!', this.saltRounds),
        isVerified: false,
        isActive: true,
        bio: 'Backend engineer specializing in scalable systems and microservices architecture',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      },
      {
        email: 'alice.johnson@example.com',
        username: 'alicejohnson',
        firstName: 'Alice',
        lastName: 'Johnson',
        displayName: 'Alice Johnson',
        password: await bcrypt.hash('Password123!', this.saltRounds),
        isVerified: true,
        isActive: false,
        bio: 'Product manager with expertise in agile development and user research',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      },
      {
        email: 'demo.user@example.com',
        username: 'demouser',
        firstName: 'Demo',
        lastName: 'User',
        displayName: 'Demo User',
        password: await bcrypt.hash('Demo123!', this.saltRounds),
        isVerified: true,
        isActive: true,
        bio: 'Demo account for testing and demonstration purposes',
      },
    ];

    let createdCount = 0;
    let skippedCount = 0;

    for (const userData of users) {
      try {
        // Check if user already exists
        const existingUser = await UserRepository.findByEmail(userData.email);
        
        if (existingUser) {
          LoggerService.debug(`User already exists: ${userData.email}`);
          skippedCount++;
          continue;
        }

        // Create user
        const user = await UserRepository.create(userData);
        LoggerService.debug(`✅ Created user: ${user.email} (${user.displayName})`);
        createdCount++;
      } catch (error) {
        LoggerService.error(`Failed to create user: ${userData.email}`, {
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
      }
    }

    LoggerService.info(`👥 User seeding completed: ${createdCount} created, ${skippedCount} skipped`);
  }

  async rollback(): Promise<void> {
    LoggerService.info('🔄 Rolling back user seeder...');

    const emailsToDelete = [
      'admin@example.com',
      'john.doe@example.com',
      'jane.smith@example.com',
      'bob.wilson@example.com',
      'alice.johnson@example.com',
      'demo.user@example.com',
    ];

    let deletedCount = 0;

    for (const email of emailsToDelete) {
      try {
        const user = await UserRepository.findByEmail(email);
        if (user) {
          await UserRepository.delete(user.id);
          LoggerService.debug(`🗑️ Deleted user: ${email}`);
          deletedCount++;
        }
      } catch (error) {
        LoggerService.error(`Failed to delete user: ${email}`, {
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        // Continue with other deletions
      }
    }

    LoggerService.info(`🔄 User rollback completed: ${deletedCount} users deleted`);
  }
}
