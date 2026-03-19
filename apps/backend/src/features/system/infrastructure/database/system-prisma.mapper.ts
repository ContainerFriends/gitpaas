import { CreateSystemConfigDto } from '../../domain/dtos/create-system-config.dto';
import { UpdateSystemConfigDto } from '../../domain/dtos/update-system-config.dto';
import { SystemConfig } from '../../domain/models/system.models';

import { SystemConfig as PrismaSystemConfig } from '@core/infrastructure/prisma/client';

/**
 * System Prisma data mapper
 */
export const systemPrismaMapper = {
    toDomain: (prismaProject: PrismaSystemConfig): SystemConfig => ({
        id: prismaProject.id,
        appId: prismaProject.appId,
        privateKey: prismaProject.privateKey,
        webhookSecret: prismaProject.webhookSecret,
        appSlug: prismaProject.appSlug,
        initializedAt: prismaProject.initializedAt,
    }),
    toPersistenceCreate: (createDto: CreateSystemConfigDto): PrismaSystemConfig => ({
        id: createDto.id,
        traceId: createDto.traceId,
        appId: createDto.appId,
        privateKey: createDto.privateKey,
        webhookSecret: createDto.webhookSecret,
        appSlug: createDto.appSlug,
        initializedAt: createDto.initializedAt,
        installedAt: null,
    }),
    toPersistenceUpdate: (updateDto: UpdateSystemConfigDto): Partial<PrismaSystemConfig> => ({
        installedAt: updateDto.installedAt,
    }),
};
