import { Repository } from '../domain/models/repository.models';
import { RepositoriesRepository } from '../domain/repositories/repositories.repository';

/**
 * Get repositories by git provider ID use case
 *
 * @param repository Repositories repository
 * @param gitProviderId Git provider ID
 *
 * @returns List of repositories
 */
export async function getRepositoriesByGitProviderUseCase(repository: RepositoriesRepository, gitProviderId: string): Promise<Repository[]> {
    return repository.getByGitProviderId(gitProviderId);
}
