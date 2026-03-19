import { GitHubAppConfig } from '../../domain/models/github-app-config.models';
import { InstallationsGithubGateway } from '../../domain/repositories/installations-github.gateway';

/**
 * Convert app manifest code use case.
 *
 * @param gateway Installations GitHub gateway
 * @param code Temporary code from GitHub app manifest flow
 *
 * @returns GitHub App configuration
 */
export async function convertGithubAppManifestCodeUseCase(gateway: InstallationsGithubGateway, code: string): Promise<GitHubAppConfig> {
    return gateway.convertAppManifestCode(code);
}
