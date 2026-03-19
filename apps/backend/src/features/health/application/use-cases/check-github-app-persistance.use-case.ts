import { SystemConfig } from '../../domain/models/system.models';
import { SystemRepository } from '../../domain/repositories/system.repository';

/**
 * Check if a GitHub App is present on persistence use case
 *
 * @param repository System repository
 *
 * @returns System configuration
 */
export async function checkGithubAppPersistanceUseCase(repository: SystemRepository): Promise<SystemConfig | null> {
    return repository.getAppConfig();
}
