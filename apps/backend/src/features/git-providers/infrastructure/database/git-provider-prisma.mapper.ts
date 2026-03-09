import { CreateGitProviderDto } from '../../domain/dtos/create-git-provider.dto';
import { UpdateGitProviderDto } from '../../domain/dtos/update-git-provider.dto';
import { GitProvider } from '../../domain/models/git-provider.models';

import { GitProvider as PrismaGitProvider, GitProviderType as PrismaGitProviderType } from '@core/infrastructure/prisma/client';

/**
 * Git provider Prisma data mapper
 */
export const gitProviderPrismaMapper = {
    toDomain: (prismaGitProvider: PrismaGitProvider): GitProvider => ({
        id: prismaGitProvider.id,
        name: prismaGitProvider.name,
        type: prismaGitProvider.type,
        createdAt: prismaGitProvider.createdAt,
        updatedAt: prismaGitProvider.updatedAt,
    }),
    toPersistenceCreate: (createDto: CreateGitProviderDto): PrismaGitProvider => ({
        id: createDto.id,
        name: createDto.name,
        type: createDto.type as PrismaGitProviderType,
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

        return updateData;
    },
};
