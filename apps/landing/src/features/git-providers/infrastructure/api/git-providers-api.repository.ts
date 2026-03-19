import { UpdateGitProviderDto } from '../../domain/dtos/update-git-provider.dto';
import { GitProvider } from '../../domain/models/git-provider.models';
import { GitProvidersRepository } from '../../domain/repositories/git-providers.repository';

import { gitProvidersApiMapper } from './git-providers-api.mapper';
import { ApiGitProvider } from './git-providers-api.models';

import { handleHttpError } from '@core/infrastructure/http/http-error.handler';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const gitProvidersApiRepository = (token: string): GitProvidersRepository => ({
    getAll: async (): Promise<GitProvider[]> => {
        const response = await fetch(`${API_BASE_URL}/git-providers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        await handleHttpError(response, 'fetch git providers');
        const data: ApiGitProvider[] = await response.json();
        return data.map(gitProvidersApiMapper.toDomain);
    },
    getById: async (id: string): Promise<GitProvider | null> => {
        const response = await fetch(`${API_BASE_URL}/git-providers/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 404) {
            return null;
        }

        await handleHttpError(response, 'fetch git provider');
        const data: ApiGitProvider = await response.json();
        return gitProvidersApiMapper.toDomain(data);
    },
    update: async (updateDto: UpdateGitProviderDto): Promise<GitProvider | null> => {
        const { id, ...body } = updateDto;
        const response = await fetch(`${API_BASE_URL}/git-providers/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        if (response.status === 404) {
            return null;
        }

        await handleHttpError(response, 'update git provider');
        const data: ApiGitProvider = await response.json();
        return gitProvidersApiMapper.toDomain(data);
    },
    remove: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/git-providers/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        await handleHttpError(response, 'remove git provider');
    },
});
