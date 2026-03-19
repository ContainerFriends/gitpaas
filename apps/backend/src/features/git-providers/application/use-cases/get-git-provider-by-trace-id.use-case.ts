import { GitProvider } from '../../domain/models/git-provider.models';
import { GitProviderRepository } from '../../domain/repositories/git-provider.repository';

/**
 * Get git provider by trace ID use case.
 *
 * @param repository Git provider repository
 * @param traceId Git provider trace ID
 *
 * @returns Git provider or null if not found
 */
export async function getGitProviderByTraceIdUseCase(repository: GitProviderRepository, traceId: string): Promise<GitProvider | null> {
    return repository.getByTraceId(traceId);
}
