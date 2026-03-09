import { GitProvider } from '../../domain/models/git-provider.models';
import { GitProviderRepository } from '../../domain/repositories/git-provider.repository';
import { createGitProviderUseCase } from '../use-cases/create-git-provider.use-case';

/**
 * Create git provider orchestrator
 *
 * @param repository Git provider repository
 * @param data Git provider creation data
 *
 * @returns Created git provider
 */
export async function createGitProviderOrchestrator(repository: GitProviderRepository, data: any): Promise<GitProvider> {
    return createGitProviderUseCase(repository, data);
}
