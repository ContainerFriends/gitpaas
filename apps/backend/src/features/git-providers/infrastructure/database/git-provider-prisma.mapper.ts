import { CreateGitProviderDto } from '../../domain/dtos/create-git-provider.dto';
import { UpdateGitProviderDto } from '../../domain/dtos/update-git-provider.dto';
import { GitProvider } from '../../domain/models/git-provider.models';

import {
    GitProvider as PrismaGitProvider,
    GitProviderType as PrismaGitProviderType,
    GitProviderStatus as PrismaGitProviderStatus,
} from '@core/infrastructure/prisma/client';

/**
 * Git provider Prisma data mapper
 */
export const gitProviderPrismaMapper = {
    toDomain: (prismaGitProvider: PrismaGitProvider): GitProvider => ({
        id: prismaGitProvider.id,
        name: prismaGitProvider.name,
        type: prismaGitProvider.type,
        externalId: prismaGitProvider.externalId,
        slug: prismaGitProvider.slug,
        traceId: prismaGitProvider.traceId,
        privateKey: prismaGitProvider.privateKey,
        clientId: prismaGitProvider.clientId,
        clientSecret: prismaGitProvider.clientSecret,
        installationId: prismaGitProvider.installationId,
        status: prismaGitProvider.status,
        createdAt: prismaGitProvider.createdAt,
        updatedAt: prismaGitProvider.updatedAt,
    }),
    toPersistenceCreate: (createDto: CreateGitProviderDto): PrismaGitProvider => ({
        id: createDto.id,
        name: createDto.name,
        type: createDto.type as PrismaGitProviderType,
        externalId: createDto.externalId,
        slug: createDto.slug,
        traceId: createDto.traceId,
        status: createDto.status as PrismaGitProviderStatus,
        privateKey: createDto.privateKey,
        clientId: createDto.clientId,
        clientSecret: createDto.clientSecret,
        installationId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    }),
    toPersistenceUpdate: (updateDto: UpdateGitProviderDto): Partial<PrismaGitProvider> => {
        const updateData: Partial<PrismaGitProvider> = {
            updatedAt: new Date(),
        };

        if (updateDto.name !== undefined) {
            updateData.name = updateDto.name;
        }

        if (updateDto.type !== undefined) {
            updateData.type = updateDto.type as PrismaGitProviderType;
        }

        if (updateDto.externalId !== undefined) {
            updateData.externalId = updateDto.externalId;
        }

        if (updateDto.slug !== undefined) {
            updateData.slug = updateDto.slug;
        }

        if (updateDto.traceId !== undefined) {
            updateData.traceId = updateDto.traceId;
        }

        if (updateDto.status !== undefined) {
            updateData.status = updateDto.status as PrismaGitProviderStatus;
        }

        if (updateDto.privateKey !== undefined) {
            updateData.privateKey = updateDto.privateKey;
        }

        if (updateDto.clientId !== undefined) {
            updateData.clientId = updateDto.clientId;
        }

        if (updateDto.clientSecret !== undefined) {
            updateData.clientSecret = updateDto.clientSecret;
        }

        if (updateDto.installationId !== undefined) {
            updateData.installationId = updateDto.installationId;
        }

        return updateData;
    },
};
