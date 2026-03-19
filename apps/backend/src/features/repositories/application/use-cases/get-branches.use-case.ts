import { RepositoryGithubGateway } from '../../domain/gateways/repository-github.gateway';
import { Branch } from '../../domain/models/branch.models';

import { GitHubAppCredentials } from '@core/domain/models/github-app-credentials.models';

/**
 * Get branches use case
 *
 * @param gateway Repository GitHub gateway
 * @param credentials GitHub App credentials
 * @param owner Repository owner
 * @param repo Repository name
 *
 * @returns List of branches
 */
export function getBranchesUseCase(
    gateway: RepositoryGithubGateway,
    credentials: GitHubAppCredentials,
    owner: string,
    repo: string,
): Promise<Branch[]> {
    return gateway.getBranches(credentials, owner, repo);
}
