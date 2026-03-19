import { Branch } from '../models/branch.models';
import { Repository } from '../models/repository.models';

/**
 * Repositories repository interface
 */
export interface RepositoriesRepository {
    /**
     * Get repositories by git provider ID
     *
     * @param gitProviderId Git provider ID
     *
     * @returns List of repositories
     */
    getByGitProviderId: (gitProviderId: string) => Promise<Repository[]>;

    /**
     * Get branches for a repository
     *
     * @param gitProviderId Git provider ID
     * @param repositoryId Repository ID
     *
     * @returns List of branches
     */
    getBranches: (gitProviderId: string, repositoryId: string) => Promise<Branch[]>;
}
