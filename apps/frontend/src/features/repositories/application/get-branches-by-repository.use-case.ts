import { Branch } from '../domain/models/branch.models';
import { RepositoriesRepository } from '../domain/repositories/repositories.repository';

/**
 * Get branches for a repository use case
 *
 * @param repository Repositories repository
 * @param gitProviderId Git provider ID
 * @param repositoryId Repository ID
 *
 * @returns List of branches
 */
export async function getBranchesByRepositoryUseCase(
    repository: RepositoriesRepository,
    gitProviderId: string,
    repositoryId: string,
): Promise<Branch[]> {
    return repository.getBranches(gitProviderId, repositoryId);
}
