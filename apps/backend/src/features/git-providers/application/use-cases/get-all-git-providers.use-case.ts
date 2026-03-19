import { GitProvider } from '../../domain/models/git-provider.models';
import { GitProviderRepository } from '../../domain/repositories/git-provider.repository';

/**
 * Get all git providers use case.
 *
 * @param repository Git provider repository
 *
 * @returns Git provider list
 */
export async function getAllGitProvidersUseCase(repository: GitProviderRepository): Promise<GitProvider[]> {
    return repository.getAll();
}
