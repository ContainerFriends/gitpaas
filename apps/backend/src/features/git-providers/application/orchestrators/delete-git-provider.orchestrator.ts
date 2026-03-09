import { GitProviderRepository } from '../../domain/repositories/git-provider.repository';
import { deleteGitProviderUseCase } from '../use-cases/delete-git-provider.use-case';

/**
 * Delete git provider orchestrator
 *
 * @param repository Git provider repository
 * @param id Git provider ID
 *
 * @returns Whether git provider was deleted
 */
export async function deleteGitProviderOrchestrator(repository: GitProviderRepository, id: string): Promise<boolean> {
    return deleteGitProviderUseCase(repository, id);
}
