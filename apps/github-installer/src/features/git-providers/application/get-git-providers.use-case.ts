import { GitProvider } from '../domain/models/git-provider.models';
import { GitProvidersRepository } from '../domain/repositories/git-providers.repository';

/**
 * Get all git providers use case.
 *
 * @param repository Git providers repository
 *
 * @returns Git provider list
 */
export async function getGitProvidersUseCase(repository: GitProvidersRepository): Promise<GitProvider[]> {
    return repository.getAll();
}
