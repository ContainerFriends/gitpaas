import { execAsync } from '../utils/exec-async';

/**
 * Run Prisma migrations
 *
 * Uses `prisma migrate deploy` which is safe for production:
 * - Only applies pending migrations
 * - Never creates new migrations
 * - Idempotent: safe to run multiple times
 */
export const runMigrations = async (): Promise<void> => {
    try {
        await execAsync('npx prisma migrate deploy --config=./prisma.config.ts');
        console.log('✅ Database migrations completed');
    } catch (error: unknown) {
        const execError = error as { stderr?: string };
        console.error('❌ Migration failed:', execError.stderr || error);
        throw error;
    }
};

/**
 * Generate Prisma client
 */
export const generatePrismaClient = async (): Promise<void> => {
    try {
        await execAsync('npx prisma generate --config=./prisma.config.ts');
        console.log('✅ Prisma client generated');
    } catch (error: unknown) {
        const execError = error as { stderr?: string };
        console.error('❌ Prisma generate failed:', execError.stderr || error);
        throw error;
    }
};
