import { CreateGitProviderDto } from '../../domain/dtos/create-git-provider.dto';
import { UpdateGitProviderDto } from '../../domain/dtos/update-git-provider.dto';
import { GitProvider } from '../../domain/models/git-provider.models';
import { GitProviderRepository } from '../../domain/repositories/git-provider.repository';

import { gitProviderPrismaMapper } from './git-provider-prisma.mapper';

import { DatabaseError, DatabaseErrorType } from '@core/domain/errors/database.error';
import { PrismaClient } from '@core/infrastructure/prisma/client';
import { prismaClient } from '@core/infrastructure/prisma/prisma.client';

/**
 * Git provider Prisma repository
 */
export const gitProviderPrismaRepository: GitProviderRepository = {
    getAll: async (): Promise<GitProvider[]> => {
        try {
            const prisma = prismaClient.getInstance() as PrismaClient;
            const gitProviders = await prisma.gitProvider.findMany({
                orderBy: { createdAt: 'desc' },
            });

            return gitProviders.map(gitProviderPrismaMapper.toDomain);
        } catch (error: unknown) {
            throw new DatabaseError(
                `Failed to retrieve git providers from database: ${(error as Error).message}`,
                DatabaseErrorType.DATABASE_CONNECTION_ERROR,
            );
        }
    },
    getById: async (id: string): Promise<GitProvider | null> => {
        try {
            const prisma = prismaClient.getInstance() as PrismaClient;
            const gitProvider = await prisma.gitProvider.findUnique({
                where: { id },
            });

            return gitProvider ? gitProviderPrismaMapper.toDomain(gitProvider) : null;
        } catch (error: unknown) {
            throw new DatabaseError(
                `Failed to retrieve git provider from database: ${(error as Error).message}`,
                DatabaseErrorType.DATABASE_CONNECTION_ERROR,
            );
        }
    },
    create: async (createDto: CreateGitProviderDto): Promise<GitProvider> => {
        try {
            const prisma = prismaClient.getInstance() as PrismaClient;
            const gitProvider = await prisma.gitProvider.create({
                data: gitProviderPrismaMapper.toPersistenceCreate(createDto),
            });

            return gitProviderPrismaMapper.toDomain(gitProvider);
        } catch (error: unknown) {
            throw new DatabaseError(`Failed to create git provider: ${(error as Error).message}`, DatabaseErrorType.DATABASE_CONNECTION_ERROR);
        }
    },
    update: async (updateDto: UpdateGitProviderDto): Promise<GitProvider | null> => {
        try {
            const prisma = prismaClient.getInstance() as PrismaClient;

            const existingGitProvider = await prisma.gitProvider.findUnique({
                where: { id: updateDto.id },
            });

            if (!existingGitProvider) {
                return null;
            }

            const updatedGitProvider = await prisma.gitProvider.update({
                where: { id: updateDto.id },
                data: gitProviderPrismaMapper.toPersistenceUpdate(updateDto),
            });

            return gitProviderPrismaMapper.toDomain(updatedGitProvider);
        } catch (error: unknown) {
            throw new DatabaseError(`Failed to update git provider: ${(error as Error).message}`, DatabaseErrorType.DATABASE_CONNECTION_ERROR);
        }
    },
    delete: async (id: string): Promise<boolean> => {
        try {
            const prisma = prismaClient.getInstance() as PrismaClient;

            const existingGitProvider = await prisma.gitProvider.findUnique({
                where: { id },
            });

            if (!existingGitProvider) {
                return false;
            }

            await prisma.gitProvider.delete({
                where: { id },
            });

            return true;
        } catch (error: unknown) {
            throw new DatabaseError(`Failed to delete git provider: ${(error as Error).message}`, DatabaseErrorType.DATABASE_CONNECTION_ERROR);
        }
    },
};
