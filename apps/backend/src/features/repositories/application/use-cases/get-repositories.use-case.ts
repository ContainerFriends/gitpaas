import { RepositoryGithubGateway } from '../../domain/gateways/repository-github.gateway';
import { Repository } from '../../domain/models/repository.models';

import { GitHubAppCredentials } from '@core/domain/models/github-app-credentials.models';

/**
 * Get repositories use case
 *
 * @param gateway Repository GitHub gateway
 * @param credentials GitHub App credentials
 * @param gitProviderId Git provider ID
 *
 * @returns List of repositories
 */
export async function getRepositoriesUseCase(
    gateway: RepositoryGithubGateway,
    credentials: GitHubAppCredentials,
    gitProviderId: string,
): Promise<Repository[]> {
    return gateway.getRepositories(credentials, gitProviderId);
}
