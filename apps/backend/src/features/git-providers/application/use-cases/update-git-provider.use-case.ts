import { UpdateGitProviderDto } from '../../domain/dtos/update-git-provider.dto';
import { GitProvider } from '../../domain/models/git-provider.models';
import { GitProviderRepository } from '../../domain/repositories/git-provider.repository';

/**
 * Update git provider use case.
 *
 * @param repository Git provider repository
 * @param data Git provider update data
 *
 * @returns Updated git provider or null if not found
 */
export async function updateGitProviderUseCase(repository: GitProviderRepository, data: any): Promise<GitProvider | null> {
    const updateDto: UpdateGitProviderDto = {
        id: data.id,
        name: data.name,
        type: data.type,
    };

    return repository.update(updateDto);
}
