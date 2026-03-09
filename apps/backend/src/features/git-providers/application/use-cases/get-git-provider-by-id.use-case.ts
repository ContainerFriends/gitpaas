import { GitProvider } from '../../domain/models/git-provider.models';
import { GitProviderRepository } from '../../domain/repositories/git-provider.repository';

/**
 * Get git provider by ID use case.
 *
 * @param repository Git provider repository
 * @param id Git provider ID
 *
 * @returns Git provider or null if not found
 */
export async function getGitProviderByIdUseCase(repository: GitProviderRepository, id: string): Promise<GitProvider | null> {
    return repository.getById(id);
}
