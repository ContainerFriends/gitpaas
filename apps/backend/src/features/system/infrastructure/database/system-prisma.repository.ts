import { CreateSystemConfigDto } from '../../domain/dtos/create-system-config.dto';
import { UpdateSystemConfigDto } from '../../domain/dtos/update-system-config.dto';
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
    createAppConfig: async (createDto: CreateSystemConfigDto): Promise<void> => {
        try {
            const prisma = prismaClient.getInstance() as PrismaClient;
            await prisma.systemConfig.create({
                data: systemPrismaMapper.toPersistenceCreate(createDto),
            });
        } catch (error: unknown) {
            throw new DatabaseError(
                `Failed to create system configuration: ${(error as Error).message}`,
                DatabaseErrorType.DATABASE_CONNECTION_ERROR,
            );
        }
    },
    updateAppConfig: async (updateDto: UpdateSystemConfigDto): Promise<void> => {
        try {
            const prisma = prismaClient.getInstance() as PrismaClient;
            await prisma.systemConfig.updateMany({
                where: {},
                data: systemPrismaMapper.toPersistenceUpdate(updateDto),
            });
        } catch (error: unknown) {
            throw new DatabaseError(
                `Failed to update system configuration: ${(error as Error).message}`,
                DatabaseErrorType.DATABASE_CONNECTION_ERROR,
            );
        }
    },
};
