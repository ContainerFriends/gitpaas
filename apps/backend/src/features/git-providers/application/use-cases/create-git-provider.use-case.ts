import { CreateGitProviderDto } from '../../domain/dtos/create-git-provider.dto';
import { GitProvider } from '../../domain/models/git-provider.models';
import { GitProviderRepository } from '../../domain/repositories/git-provider.repository';

/**
 * Create git provider use case.
 *
 * @param repository Git provider repository
 * @param data Git provider creation data
 *
 * @returns Created git provider
 */
export async function createGitProviderUseCase(repository: GitProviderRepository, data: any): Promise<GitProvider> {
    const createDto: CreateGitProviderDto = {
        id: data.id,
        name: data.name,
        type: data.type,
        externalId: data.externalId,
        slug: data.slug,
        traceId: data.traceId,
        status: 'pending',
        privateKey: data.privateKey,
    };

    return repository.create(createDto);
}
