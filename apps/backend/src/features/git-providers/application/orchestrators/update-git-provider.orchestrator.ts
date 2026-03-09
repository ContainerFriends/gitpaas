import { GitProvider } from '../../domain/models/git-provider.models';
import { GitProviderRepository } from '../../domain/repositories/git-provider.repository';
import { updateGitProviderUseCase } from '../use-cases/update-git-provider.use-case';

/**
 * Update git provider orchestrator
 *
 * @param repository Git provider repository
 * @param data Git provider update data
 *
 * @returns Updated git provider or null if not found
 */
export async function updateGitProviderOrchestrator(repository: GitProviderRepository, data: any): Promise<GitProvider | null> {
    return updateGitProviderUseCase(repository, data);
}
