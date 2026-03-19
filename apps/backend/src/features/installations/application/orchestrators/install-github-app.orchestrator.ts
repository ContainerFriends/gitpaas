import { GitHubAppConfig } from '../../domain/models/github-app-config.models';
import { InstallationsGithubGateway } from '../../domain/repositories/installations-github.gateway';
import { convertGithubAppManifestCodeUseCase } from '../use-cases/convert-github-app-manifest-code.use-case';

import { createSystemConfigUseCase } from '@features/system/application/use-cases/create-system-config.use-case';
import { SystemRepository } from '@features/system/domain/repositories/system.repository';

/**
 * Install GitHub App orchestrator
 *
 * @param repository System repository
 * @param gateway Installations GitHub gateway
 * @param code Temporary code from GitHub app manifest flow
 * @param traceId Trace ID
 *
 * @returns GitHub App configuration
 */
export async function installGithubAppOrchestrator(
    repository: SystemRepository,
    gateway: InstallationsGithubGateway,
    code: string,
    traceId: string,
): Promise<GitHubAppConfig> {
    const appConfig = await convertGithubAppManifestCodeUseCase(gateway, code);

    await createSystemConfigUseCase(repository, {
        traceId,
        appId: appConfig.id.toString(),
        privateKey: appConfig.pem,
        webhookSecret: appConfig.webhookSecret,
        appSlug: appConfig.slug,
        initializedAt: new Date(),
    });

    return appConfig;
}
