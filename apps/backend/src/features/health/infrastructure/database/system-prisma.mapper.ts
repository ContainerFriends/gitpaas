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
};
