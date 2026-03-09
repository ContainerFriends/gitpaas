import { GitProvider } from '../../domain/models/git-provider.models';
import { GitProviderRepository } from '../../domain/repositories/git-provider.repository';
import { getAllGitProvidersUseCase } from '../use-cases/get-all-git-providers.use-case';

/**
 * Get git providers orchestrator
 *
 * @param repository Git provider repository
 *
 * @returns Git provider list
 */
export async function getGitProvidersOrchestrator(repository: GitProviderRepository): Promise<GitProvider[]> {
    return getAllGitProvidersUseCase(repository);
}
