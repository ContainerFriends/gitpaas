import { GitProvider } from '../../domain/models/git-provider.models';
import { GitProviderRepository } from '../../domain/repositories/git-provider.repository';
import { getGitProviderByIdUseCase } from '../use-cases/get-git-provider-by-id.use-case';

/**
 * Get git provider by ID orchestrator
 *
 * @param repository Git provider repository
 * @param id Git provider ID
 *
 * @returns Git provider or null if not found
 */
export async function getGitProviderByIdOrchestrator(repository: GitProviderRepository, id: string): Promise<GitProvider | null> {
    return getGitProviderByIdUseCase(repository, id);
}
