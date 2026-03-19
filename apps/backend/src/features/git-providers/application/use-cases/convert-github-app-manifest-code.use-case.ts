import { GitHubAppConfig } from '../../domain/models/github-app-config.models';
import { GitProviderGithubGateway } from '../../domain/repositories/git-provider-github.gateway';

/**
 * Convert app manifest code use case.
 *
 * @param gateway Git provider GitHub gateway
 * @param code Temporary code from GitHub app manifest flow
 *
 * @returns GitHub App configuration
 */
export async function convertGithubAppManifestCodeUseCase(gateway: GitProviderGithubGateway, code: string): Promise<GitHubAppConfig> {
    return gateway.convertAppManifestCode(code);
}
