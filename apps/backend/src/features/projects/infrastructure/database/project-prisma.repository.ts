import { PrismaClient } from '@core/infrastructure/prisma/generated/client';

import { CreateProjectDto } from '../../domain/dtos/create-project.dto';
import { UpdateProjectDto } from '../../domain/dtos/update-project.dto';
import { Project } from '../../domain/models/project.models';
import { ProjectRepository } from '../../domain/repositories/project.repository';

import { projectPrismaMapper } from './project-prisma.mapper';

import { DatabaseError, DatabaseErrorType } from '@core/domain/errors/database.error';
import { prismaClient } from '@core/infrastructure/prisma/prisma.client';

/**
 * Project Prisma repository
 */
export const projectPrismaRepository: ProjectRepository = {
    getAll: async (): Promise<Project[]> => {
        try {
            const prisma = prismaClient.getInstance() as PrismaClient;
            const projects = await prisma.project.findMany({
                orderBy: { createdAt: 'desc' },
            });

            return projects.map(projectPrismaMapper.toDomain);
        } catch (error: unknown) {
            throw new DatabaseError(
                `Failed to retrieve projects from database: ${(error as Error).message}`,
                DatabaseErrorType.DATABASE_CONNECTION_ERROR,
            );
        }
    },
    getById: async (id: string): Promise<Project | null> => {
        try {
            const prisma = prismaClient.getInstance() as PrismaClient;
            const project = await prisma.project.findUnique({
                where: { id },
            });

            return project ? projectPrismaMapper.toDomain(project) : null;
        } catch (error: unknown) {
            throw new DatabaseError(
                `Failed to retrieve project from database: ${(error as Error).message}`,
                DatabaseErrorType.DATABASE_CONNECTION_ERROR,
            );
        }
    },
    create: async (createDto: CreateProjectDto): Promise<Project> => {
        try {
            const prisma = prismaClient.getInstance() as PrismaClient;
            const project = await prisma.project.create({
                data: projectPrismaMapper.toPersistenceCreate(createDto),
            });

            return projectPrismaMapper.toDomain(project);
        } catch (error: unknown) {
            throw new DatabaseError(`Failed to create project: ${(error as Error).message}`, DatabaseErrorType.DATABASE_CONNECTION_ERROR);
        }
    },
    update: async (updateDto: UpdateProjectDto): Promise<Project | null> => {
        try {
            const prisma = prismaClient.getInstance() as PrismaClient;

            // Check if project exists
            const existingProject = await prisma.project.findUnique({
                where: { id: updateDto.id },
            });

            if (!existingProject) {
                return null;
            }

            const updatedProject = await prisma.project.update({
                where: { id: updateDto.id },
                data: projectPrismaMapper.toPersistenceUpdate(updateDto),
            });

            return projectPrismaMapper.toDomain(updatedProject);
        } catch (error: unknown) {
            throw new DatabaseError(`Failed to update project: ${(error as Error).message}`, DatabaseErrorType.DATABASE_CONNECTION_ERROR);
        }
    },
    delete: async (id: string): Promise<boolean> => {
        try {
            const prisma = prismaClient.getInstance() as PrismaClient;

            // Check if project exists
            const existingProject = await prisma.project.findUnique({
                where: { id },
            });

            if (!existingProject) {
                return false;
            }

            await prisma.project.delete({
                where: { id },
            });

            return true;
        } catch (error: unknown) {
            throw new DatabaseError(`Failed to delete project: ${(error as Error).message}`, DatabaseErrorType.DATABASE_CONNECTION_ERROR);
        }
    },
};
