import { UpdateGitProviderDto } from '../domain/dtos/update-git-provider.dto';
import { GitProvider } from '../domain/models/git-provider.models';
import { GitProvidersRepository } from '../domain/repositories/git-providers.repository';

/**
 * Update git provider use case.
 *
 * @param repository Git providers repository
 * @param data Git provider update data
 *
 * @returns Updated git provider or null if not found
 */
export async function updateGitProviderUseCase(repository: GitProvidersRepository, data: any): Promise<GitProvider | null> {
    const updateDto: UpdateGitProviderDto = {
        id: data.id,
        name: data.name,
        type: data.type,
    };

    return repository.update(updateDto);
}
