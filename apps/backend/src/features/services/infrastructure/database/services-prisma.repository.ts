import { CreateServiceDto } from '../../domain/dtos/create-service.dto';
import { UpdateServiceDto } from '../../domain/dtos/update-service.dto';
import { Service } from '../../domain/models/service.models';
import { ServicesRepository } from '../../domain/repositories/services.repository';

import { servicePrismaMapper } from './service-prisma.mapper';

import { DatabaseError, DatabaseErrorType } from '@core/domain/errors/database.error';
import { PrismaClient } from '@core/infrastructure/prisma/client';
import { prismaClient } from '@core/infrastructure/prisma/prisma.client';

/**
 * Services Prisma repository
 */
export const servicesPrismaRepository: ServicesRepository = {
    getAll: async (): Promise<Service[]> => {
        try {
            const prisma = prismaClient.getInstance() as PrismaClient;
            const services = await prisma.service.findMany({
                orderBy: { createdAt: 'desc' },
            });

            return services.map(servicePrismaMapper.toDomain);
        } catch (error: unknown) {
            throw new DatabaseError(
                `Failed to retrieve services from database: ${(error as Error).message}`,
                DatabaseErrorType.DATABASE_CONNECTION_ERROR,
            );
        }
    },
    getByProjectId: async (projectId: string): Promise<Service[]> => {
        try {
            const prisma = prismaClient.getInstance() as PrismaClient;
            const services = await prisma.service.findMany({
                where: { projectId },
                orderBy: { createdAt: 'desc' },
            });

            return services.map(servicePrismaMapper.toDomain);
        } catch (error: unknown) {
            throw new DatabaseError(
                `Failed to retrieve services for project ${projectId} from database: ${(error as Error).message}`,
                DatabaseErrorType.DATABASE_CONNECTION_ERROR,
            );
        }
    },
    getById: async (id: string): Promise<Service | null> => {
        try {
            const prisma = prismaClient.getInstance() as PrismaClient;
            const service = await prisma.service.findUnique({
                where: { id },
            });

            return service ? servicePrismaMapper.toDomain(service) : null;
        } catch (error: unknown) {
            throw new DatabaseError(
                `Failed to retrieve service ${id} from database: ${(error as Error).message}`,
                DatabaseErrorType.DATABASE_CONNECTION_ERROR,
            );
        }
    },
    create: async (createDto: CreateServiceDto): Promise<Service> => {
        try {
            const prisma = prismaClient.getInstance() as PrismaClient;
            const createdService = await prisma.service.create({
                data: servicePrismaMapper.toPersistenceCreate(createDto),
            });

            return servicePrismaMapper.toDomain(createdService);
        } catch (error: unknown) {
            throw new DatabaseError(`Failed to create service: ${(error as Error).message}`, DatabaseErrorType.DATABASE_CONNECTION_ERROR);
        }
    },
    update: async (id: string, updateDto: UpdateServiceDto): Promise<Service> => {
        try {
            const prisma = prismaClient.getInstance() as PrismaClient;
            const updatedService = await prisma.service.update({
                where: { id },
                data: servicePrismaMapper.toPersistenceUpdate(updateDto),
            });

            return servicePrismaMapper.toDomain(updatedService);
        } catch (error: unknown) {
            throw new DatabaseError(`Failed to update service ${id}: ${(error as Error).message}`, DatabaseErrorType.DATABASE_CONNECTION_ERROR);
        }
    },
    delete: async (id: string): Promise<void> => {
        try {
            const prisma = prismaClient.getInstance() as PrismaClient;
            await prisma.service.delete({
                where: { id },
            });
        } catch (error: unknown) {
            throw new DatabaseError(`Failed to delete service ${id}: ${(error as Error).message}`, DatabaseErrorType.DATABASE_CONNECTION_ERROR);
        }
    },
};
