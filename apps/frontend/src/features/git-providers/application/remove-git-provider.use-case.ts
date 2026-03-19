import { GitProvidersRepository } from '../domain/repositories/git-providers.repository';

/**
 * Remove git provider use case.
 *
 * @param repository Git providers repository
 * @param id Git provider ID
 *
 * @returns void
 */
export async function removeGitProviderUseCase(repository: GitProvidersRepository, id: string): Promise<void> {
    return repository.remove(id);
}
