import { GitProvider } from '../domain/models/git-provider.models';
import { GitProvidersRepository } from '../domain/repositories/git-providers.repository';

/**
 * Get git provider by ID use case.
 *
 * @param repository Git providers repository
 * @param id Git provider ID
 *
 * @returns Git provider or null if not found
 */
export async function getGitProviderByIdUseCase(repository: GitProvidersRepository, id: string): Promise<GitProvider | null> {
    return repository.getById(id);
}
