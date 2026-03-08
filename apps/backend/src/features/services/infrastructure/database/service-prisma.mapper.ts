import { CreateServiceDto } from '../../domain/dtos/create-service.dto';
import { UpdateServiceDto } from '../../domain/dtos/update-service.dto';
import { Service } from '../../domain/models/service.models';

import { Service as PrismaService } from '@core/infrastructure/prisma/client';

/**
 * Service Prisma data mapper
 */
export const servicePrismaMapper = {
    toDomain: (prismaService: PrismaService): Service => ({
        id: prismaService.id,
        name: prismaService.name,
        repositoryId: prismaService.repositoryId,
        branch: prismaService.branch,
        projectId: prismaService.projectId,
        createdAt: prismaService.createdAt.toISOString(),
        updatedAt: prismaService.updatedAt.toISOString(),
    }),
    toPersistenceCreate: (createDto: CreateServiceDto): any => ({
        id: createDto.id,
        name: createDto.name,
        repositoryId: createDto.repositoryId,
        branch: createDto.branch || 'main',
        projectId: createDto.projectId,
    }),
    toPersistenceUpdate: (updateDto: UpdateServiceDto): any => {
        const updateData: any = {};
        if (updateDto.name !== undefined) updateData.name = updateDto.name;
        if (updateDto.repositoryId !== undefined) updateData.repositoryId = updateDto.repositoryId;
        if (updateDto.branch !== undefined) updateData.branch = updateDto.branch;
        return updateData;
    },
};
