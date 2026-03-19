import { CreateServiceDto } from '../../domain/dtos/create-service.dto';
import { UpdateServiceDto } from '../../domain/dtos/update-service.dto';
import { Service } from '../../domain/models/service.models';
import { ServicesRepository } from '../../domain/repositories/services.repository';

import { servicesApiMapper } from './services-api.mapper';
import { ApiService } from './services-api.models';

import { handleHttpError } from '@core/infrastructure/http/http-error.handler';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Services API repository
 */
export const servicesApiRepository = (token: string): ServicesRepository => ({
    getByProjectId: async (projectId: string): Promise<Service[]> => {
        const response = await fetch(`${API_BASE_URL}/services/project/${projectId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        await handleHttpError(response, 'fetch services by project');

        const data: ApiService[] = await response.json();

        return data.map(servicesApiMapper.toDomain);
    },
    getById: async (id: string): Promise<Service | null> => {
        const response = await fetch(`${API_BASE_URL}/services/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 404) {
            return null;
        }

        await handleHttpError(response, 'fetch service');

        const data: ApiService = await response.json();

        return servicesApiMapper.toDomain(data);
    },
    create: async (createDto: CreateServiceDto): Promise<Service> => {
        const response = await fetch(`${API_BASE_URL}/services`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ...createDto }),
        });

        await handleHttpError(response, 'create service');

        const data: ApiService = await response.json();

        return servicesApiMapper.toDomain(data);
    },
    update: async (id: string, updateDto: UpdateServiceDto): Promise<Service> => {
        const response = await fetch(`${API_BASE_URL}/services/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ...updateDto }),
        });

        await handleHttpError(response, 'update service');

        const data: ApiService = await response.json();

        return servicesApiMapper.toDomain(data);
    },
    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/services/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        await handleHttpError(response, 'delete service');
    },
});
