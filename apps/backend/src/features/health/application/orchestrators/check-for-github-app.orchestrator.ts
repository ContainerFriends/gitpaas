import { GithubAppStatus } from '../../domain/models/health.models';
import { checkGithubAppPersistanceUseCase } from '../use-cases/check-github-app-persistance.use-case';
import { generateGithubManifestUrlUseCase } from '../use-cases/generate-github-manifest-url.use-case';

import { SystemRepository } from '@features/system/domain/repositories/system.repository';

/**
 * Check if a GitHub App is installed orchestrator
 *
 * @param repository System repository
 * @param clientToken Client token
 * @param apiVersion API version to use in the manifest
 *
 * @returns Status of the GitHub App installation
 */
export async function checkForGithubAppOrchestrator(repository: SystemRepository, clientToken: string, apiVersion: string): Promise<GithubAppStatus> {
    const isTokenValid = clientToken === process.env.SETUP_TOKEN;

    if (!isTokenValid) {
        return {
            isInstalled: false,
            error: 'Unauthorized: Invalid setup token',
        };
    }

    const existsOnPersistance = await checkGithubAppPersistanceUseCase(repository);

    if (!existsOnPersistance) {
        return {
            isInstalled: false,
            installUrl: generateGithubManifestUrlUseCase(apiVersion),
        };
    }

    // Comprobar en Github

    return {
        isInstalled: true,
    };
}
