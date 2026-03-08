import { PrismaPg } from '@prisma/adapter-pg';

import { DatabaseClient } from '../../domain/interfaces/database-client.interface';
import { appLogger } from '../loggers/winston.logger';

// eslint-disable-next-line import/no-relative-packages
import { PrismaClient } from './client';

/**
 * Global Prisma client instance
 */
let prismaInstance: PrismaClient | null = null;

/**
 * Create and configure a new Prisma client instance with PostgreSQL adapter
 */
const createPrismaClient = (): PrismaClient => {
    const connectionString = `${process.env.DATABASE_URL}`;
    const adapter = new PrismaPg({ connectionString });

    return new PrismaClient({
        adapter,
        log: process.env.ENVIRONMENT === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
};

/**
 * Prisma database client management
 */
export const prismaClient: DatabaseClient = {
    getInstance: () => {
        if (!prismaInstance) {
            prismaInstance = createPrismaClient();
        }
        return prismaInstance;
    },
    connect: async (): Promise<void> => {
        try {
            const client = prismaClient.getInstance() as PrismaClient;
            await client.$connect();
            appLogger.info({ message: 'Successfully connected to PostgreSQL database using Prisma' }, 'PrismaClient');
        } catch (error) {
            appLogger.error(
                {
                    message: 'Failed to connect to database',
                    error: error instanceof Error ? error.message : String(error),
                },
                'PrismaClient',
            );
            throw error;
        }
    },
    disconnect: async (): Promise<void> => {
        try {
            if (prismaInstance) {
                await prismaInstance.$disconnect();
                prismaInstance = null;
            }
            appLogger.info({ message: 'Disconnected from PostgreSQL database' }, 'PrismaClient');
        } catch (error) {
            appLogger.error(
                {
                    message: 'Error disconnecting from database',
                    error: error instanceof Error ? error.message : String(error),
                },
                'PrismaClient',
            );
            throw error;
        }
    },
    healthCheck: async (): Promise<boolean> => {
        try {
            const client = prismaClient.getInstance() as PrismaClient;
            await client.$executeRaw`SELECT 1 as health_check`;
            return true;
        } catch (error) {
            appLogger.error(
                {
                    message: 'Database health check failed',
                    error: error instanceof Error ? error.message : String(error),
                },
                'PrismaClient',
            );
            return false;
        }
    },
};
