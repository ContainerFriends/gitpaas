import { Branch } from '../../domain/models/branch.models';
import { Repository } from '../../domain/models/repository.models';
import { RepositoriesRepository } from '../../domain/repositories/repositories.repository';

import { repositoriesApiMapper } from './repositories-api.mapper';
import { ApiBranch, ApiRepository } from './repositories-api.models';

import { handleHttpError } from '@core/infrastructure/http/http-error.handler';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Repositories API repository
 */
export const repositoriesApiRepository = (token: string): RepositoriesRepository => ({
    getByGitProviderId: async (gitProviderId: string): Promise<Repository[]> => {
        const response = await fetch(`${API_BASE_URL}/repositories?gitProviderId=${encodeURIComponent(gitProviderId)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        await handleHttpError(response, 'fetch repositories');

        const data: ApiRepository[] = await response.json();

        return data.map(repositoriesApiMapper.toDomain);
    },

    getBranches: async (gitProviderId: string, repositoryId: string): Promise<Branch[]> => {
        const params = new URLSearchParams({ gitProviderId, repositoryId });
        const response = await fetch(`${API_BASE_URL}/repositories/branches?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        await handleHttpError(response, 'fetch branches');

        const data: ApiBranch[] = await response.json();

        return data.map(repositoriesApiMapper.branchToDomain);
    },
});
