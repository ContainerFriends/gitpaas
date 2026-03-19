import { Branch } from '../models/branch.models';
import { Repository } from '../models/repository.models';

import { GitHubAppCredentials } from '@core/domain/models/github-app-credentials.models';

/**
 * Repository GitHub gateway interface
 */
export interface RepositoryGithubGateway {
    /**
     * Get repositories accessible by a GitHub App installation
     *
     * @param credentials GitHub App credentials
     * @param gitProviderId Git provider ID to attach to mapped repositories
     *
     * @returns List of repositories
     */
    getRepositories: (credentials: GitHubAppCredentials, gitProviderId: string) => Promise<Repository[]>;

    /**
     * Get branches for a repository
     *
     * @param credentials GitHub App credentials
     * @param owner Repository owner
     * @param repo Repository name
     *
     * @returns List of branches
     */
    getBranches: (credentials: GitHubAppCredentials, owner: string, repo: string) => Promise<Branch[]>;
}
