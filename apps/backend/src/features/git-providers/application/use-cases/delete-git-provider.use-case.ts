import { GitProviderRepository } from '../../domain/repositories/git-provider.repository';

/**
 * Delete git provider use case.
 *
 * @param repository Git provider repository
 * @param id Git provider ID
 *
 * @returns Whether git provider was deleted
 */
export async function deleteGitProviderUseCase(repository: GitProviderRepository, id: string): Promise<boolean> {
    return repository.delete(id);
}
