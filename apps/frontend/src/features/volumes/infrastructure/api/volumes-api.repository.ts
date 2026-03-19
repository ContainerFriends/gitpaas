import { Volume } from '../../domain/models/volume.models';
import { VolumesRepository } from '../../domain/repositories/volumes.repository';

import { volumesApiMapper } from './volumes-api.mapper';
import { ApiVolume } from './volumes-api.models';

import { handleHttpError } from '@core/infrastructure/http/http-error.handler';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Volumes API repository
 */
export const volumesApiRepository = (token: string): VolumesRepository => ({
    getAll: async (): Promise<Volume[]> => {
        const response = await fetch(`${API_BASE_URL}/volumes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        await handleHttpError(response, 'fetch volumes');

        const data: ApiVolume[] = await response.json();

        return data.map(volumesApiMapper.toDomain);
    },

    remove: async (name: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/volumes/${encodeURIComponent(name)}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        await handleHttpError(response, 'remove volume');
    },
});
