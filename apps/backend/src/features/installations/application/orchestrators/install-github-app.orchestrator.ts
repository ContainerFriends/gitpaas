import { GitHubAppConfig } from '../../domain/models/github-app-config.models';
import { InstallationsGithubGateway } from '../../domain/repositories/installations-github.gateway';
import { convertGithubAppManifestCodeUseCase } from '../use-cases/convert-github-app-manifest-code.use-case';

/**
 * Install GitHub App orchestrator
 *
 * @param gateway Installations GitHub gateway
 * @param code Temporary code from GitHub app manifest flow
 *
 * @returns GitHub App configuration
 */
export async function installGithubAppOrchestrator(gateway: InstallationsGithubGateway, code: string): Promise<GitHubAppConfig> {
    const appConfig = await convertGithubAppManifestCodeUseCase(gateway, code);

    return appConfig;
}
