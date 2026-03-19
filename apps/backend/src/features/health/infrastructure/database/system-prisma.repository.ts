import { SystemConfig } from '../../domain/models/system.models';
import { SystemRepository } from '../../domain/repositories/system.repository';

import { systemPrismaMapper } from './system-prisma.mapper';

import { DatabaseError, DatabaseErrorType } from '@core/domain/errors/database.error';
import { PrismaClient } from '@core/infrastructure/prisma/client';
import { prismaClient } from '@core/infrastructure/prisma/prisma.client';

/**
 * System Prisma repository
 */
export const systemPrismaRepository: SystemRepository = {
    getAppConfig: async (): Promise<SystemConfig | null> => {
        try {
            const prisma = prismaClient.getInstance() as PrismaClient;
            const systemConfig = await prisma.systemConfig.findFirst();

            if (!systemConfig) return null;

            return systemPrismaMapper.toDomain(systemConfig);
        } catch (error: unknown) {
            throw new DatabaseError(
                `Failed to retrieve projects from database: ${(error as Error).message}`,
                DatabaseErrorType.DATABASE_CONNECTION_ERROR,
            );
        }
    },
};
