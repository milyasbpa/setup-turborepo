import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Standalone cleanup script for math learning app data
 * This script removes all math learning related data while preserving the user accounts
 */
async function cleanup() {
  console.log('🧹 Starting math learning app data cleanup...');
  console.log('⚠️  This will remove all lessons, problems, submissions, and user progress');
  console.log('⚠️  User accounts will be preserved but XP/streak data will be reset');
  
  try {
    // Start transaction for atomic cleanup
    await prisma.$transaction(async (tx) => {
      // Delete in reverse dependency order to avoid foreign key violations
      
      console.log('🗑️  Deleting user progress records...');
      const deletedProgress = await tx.userProgress.deleteMany({});
      console.log(`   ✅ Deleted ${deletedProgress.count} user progress records`);

      console.log('🗑️  Deleting submissions...');
      const deletedSubmissions = await tx.submission.deleteMany({});
      console.log(`   ✅ Deleted ${deletedSubmissions.count} submissions`);

      console.log('🗑️  Deleting problem options...');
      const deletedOptions = await tx.problemOption.deleteMany({});
      console.log(`   ✅ Deleted ${deletedOptions.count} problem options`);

      console.log('🗑️  Deleting problems...');
      const deletedProblems = await tx.problem.deleteMany({});
      console.log(`   ✅ Deleted ${deletedProblems.count} problems`);

      console.log('🗑️  Deleting lessons...');
      const deletedLessons = await tx.lesson.deleteMany({});
      console.log(`   ✅ Deleted ${deletedLessons.count} lessons`);

      console.log('🔄 Resetting user XP and streak data...');
      const updatedUsers = await tx.user.updateMany({
        where: {},
        data: {
          totalXp: 0,
          currentStreak: 0,
          bestStreak: 0,
          lastActivityDate: null,
        },
      });
      console.log(`   ✅ Reset XP/streak data for ${updatedUsers.count} users`);
    });

    console.log('🎉 Cleanup completed successfully!');
    console.log('💡 You can now run seeding to add fresh data:');
    console.log('   npm run seed');
    console.log('   npm run seed reset  (clean + seed in one command)');
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    console.error('💡 Make sure the database is running and accessible');
    process.exit(1);
  }
}

// Run cleanup if this file is executed directly
if (require.main === module) {
  cleanup()
    .catch((error) => {
      console.error('❌ Cleanup script failed:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      console.log('📤 Database connection closed');
    });
}

export { cleanup };
