import { GitHubAppConfig } from '../../domain/models/github-app-config.models';
import { GitProviderGithubGateway } from '../../domain/repositories/git-provider-github.gateway';
import { GitProviderRepository } from '../../domain/repositories/git-provider.repository';
import { convertGithubAppManifestCodeUseCase } from '../use-cases/convert-github-app-manifest-code.use-case';
import { createGitProviderUseCase } from '../use-cases/create-git-provider.use-case';

/**
 * Install GitHub App orchestrator
 *
 * @param gateway Git provider GitHub gateway
 * @param repository Git provider repository
 * @param code Temporary code from GitHub app manifest flow
 *
 * @returns GitHub App configuration
 */
export async function installGithubAppOrchestrator(
    gateway: GitProviderGithubGateway,
    repository: GitProviderRepository,
    code: string,
    traceId: string,
    state: any,
): Promise<GitHubAppConfig> {
    const appConfig = await convertGithubAppManifestCodeUseCase(gateway, code);

    await createGitProviderUseCase(repository, {
        ...state,
        type: 'github',
        externalId: appConfig.id.toString(),
        slug: appConfig.slug,
        traceId,
        privateKey: appConfig.pem,
    });

    return appConfig;
}
