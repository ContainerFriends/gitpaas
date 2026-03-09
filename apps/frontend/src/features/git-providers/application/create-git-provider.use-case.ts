import { v4 as uuidv4 } from 'uuid';

import { CreateGitProviderDto } from '../domain/dtos/create-git-provider.dto';
import { GitProvider } from '../domain/models/git-provider.models';
import { GitProvidersRepository } from '../domain/repositories/git-providers.repository';

/**
 * Create git provider use case.
 *
 * @param repository Git providers repository
 * @param data Git provider creation data
 *
 * @returns Created git provider
 */
export async function createGitProviderUseCase(repository: GitProvidersRepository, data: any): Promise<GitProvider> {
    const createDto: CreateGitProviderDto = {
        id: uuidv4(),
        name: data.name,
        type: data.type,
    };

    return repository.create(createDto);
}
