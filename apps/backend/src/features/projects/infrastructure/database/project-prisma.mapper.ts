import { Project as PrismaProject } from '@core/infrastructure/prisma/generated/client';

import { CreateProjectDto } from '../../domain/dtos/create-project.dto';
import { UpdateProjectDto } from '../../domain/dtos/update-project.dto';
import { Project } from '../../domain/models/project.models';

/**
 * Project Prisma data mapper
 */
export const projectPrismaMapper = {
    toDomain: (prismaProject: PrismaProject): Project => ({
        id: prismaProject.id,
        name: prismaProject.name,
        createdAt: prismaProject.createdAt,
        updatedAt: prismaProject.updatedAt,
    }),
    toPersistenceCreate: (createDto: CreateProjectDto): PrismaProject => ({
        id: createDto.id,
        name: createDto.name,
        createdAt: new Date(),
        updatedAt: new Date(),
    }),
    toPersistenceUpdate: (updateDto: UpdateProjectDto): Partial<PrismaProject> => {
        const updateData: Partial<PrismaProject> = {
            updatedAt: new Date(),
        };

        if (updateDto.name !== undefined) {
            updateData.name = updateDto.name;
        }

        return updateData;
    },
};
