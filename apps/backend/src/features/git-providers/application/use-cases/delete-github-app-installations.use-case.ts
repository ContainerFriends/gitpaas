import { GitProviderGithubGateway } from '../../domain/repositories/git-provider-github.gateway';

import { GitHubAppCredentials } from '@core/domain/models/github-app-credentials.models';

/**
 * Delete GitHub App installations use case.
 *
 * @param gateway Git provider GitHub gateway
 * @param credentials GitHub App credentials
 */
export function deleteGithubAppInstallationsUseCase(gateway: GitProviderGithubGateway, credentials: GitHubAppCredentials): Promise<void> {
    return gateway.deleteInstallations(credentials);
}
