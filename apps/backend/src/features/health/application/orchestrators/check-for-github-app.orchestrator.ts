import { GithubAppStatus } from '../../domain/models/health.models';
import { SystemRepository } from '../../domain/repositories/system.repository';
import { checkGithubAppPersistanceUseCase } from '../use-cases/check-github-app-persistance.use-case';

/**
 * Check if a GitHub App is installed orchestrator
 *
 * @param repository System repository
 *
 * @returns Status of the GitHub App installation
 */
export async function checkForGithubAppOrchestrator(repository: SystemRepository): Promise<GithubAppStatus> {
    const existsOnPersistance = await checkGithubAppPersistanceUseCase(repository);

    if (!existsOnPersistance) {
        return {
            isInstalled: false,
            installUrl: 'dsdsdsd',
        };
    }

    // Comprobar en Github

    return {
        isInstalled: true,
    };
}
