import { Container } from '../../domain/models/container.models';
import { ContainersRepository } from '../../domain/repositories/containers.repository';

import { containersApiMapper } from './containers-api.mapper';
import { ApiContainer } from './containers-api.models';

import { handleHttpError } from '@core/infrastructure/http/http-error.handler';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Containers API repository
 */
export const containersApiRepository = (token: string): ContainersRepository => ({
    getAll: async (): Promise<Container[]> => {
        const response = await fetch(`${API_BASE_URL}/containers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        await handleHttpError(response, 'fetch containers');

        const data: ApiContainer[] = await response.json();

        return data.map(containersApiMapper.toDomain);
    },

    remove: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/containers/${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        await handleHttpError(response, 'remove container');
    },
});
