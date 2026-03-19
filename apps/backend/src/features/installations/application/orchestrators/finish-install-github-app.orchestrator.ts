import { updateSystemConfigUseCase } from '@features/system/application/use-cases/update-system-config.use-case';
import { SystemRepository } from '@features/system/domain/repositories/system.repository';

/**
 * Finish install GitHub App orchestrator
 *
 * @param repository System repository
 * @param traceId Trace ID for logging
 * @param installationId GitHub App installation ID
 */
export async function finishInstallGithubAppOrchestrator(repository: SystemRepository, _traceId: string, _installationId: string): Promise<void> {
    await updateSystemConfigUseCase(repository);
}
