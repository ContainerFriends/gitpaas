import { CreateNetworkDto } from '../../domain/dtos/create-network.dto';
import { Network } from '../../domain/models/network.models';
import { NetworksRepository } from '../../domain/repositories/networks.repository';

import { networksApiMapper } from './networks-api.mapper';
import { ApiNetwork } from './networks-api.models';

import { handleHttpError } from '@core/infrastructure/http/http-error.handler';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Networks API repository
 */
export const networksApiRepository = (token: string): NetworksRepository => ({
    getAll: async (): Promise<Network[]> => {
        const response = await fetch(`${API_BASE_URL}/networks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        await handleHttpError(response, 'fetch networks');

        const data: ApiNetwork[] = await response.json();

        return data.map(networksApiMapper.toDomain);
    },

    getById: async (id: string): Promise<Network | null> => {
        const response = await fetch(`${API_BASE_URL}/networks/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 404) {
            return null;
        }

        await handleHttpError(response, 'fetch network');

        const data: ApiNetwork = await response.json();

        return networksApiMapper.toDomain(data);
    },

    create: async (createDto: CreateNetworkDto): Promise<Network> => {
        const response = await fetch(`${API_BASE_URL}/networks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ...createDto }),
        });

        await handleHttpError(response, 'create network');

        const data: ApiNetwork = await response.json();

        return networksApiMapper.toDomain(data);
    },

    remove: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/networks/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        await handleHttpError(response, 'remove network');
    },
});