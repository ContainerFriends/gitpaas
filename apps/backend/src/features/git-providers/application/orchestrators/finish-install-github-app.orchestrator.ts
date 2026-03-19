import { GitProviderRepository } from '../../domain/repositories/git-provider.repository';
import { getGitProviderByTraceIdUseCase } from '../use-cases/get-git-provider-by-trace-id.use-case';
import { updateGitProviderUseCase } from '../use-cases/update-git-provider.use-case';

/**
 * Finish install GitHub App orchestrator
 *
 * @param repository Git provider repository
 * @param traceId Trace ID for logging and correlation
 * @param installationId GitHub App installation ID
 */
export async function finishInstallGithubAppOrchestrator(repository: GitProviderRepository, traceId: string, installationId: string): Promise<void> {
    const gitProvider = await getGitProviderByTraceIdUseCase(repository, traceId);

    if (gitProvider) {
        const data = {
            id: gitProvider.id,
            name: gitProvider.name,
            type: gitProvider.type,
            externalId: gitProvider.externalId,
            slug: gitProvider.slug,
            traceId,
            status: 'active',
            installationId,
        };

        await updateGitProviderUseCase(repository, data);
    }
}
