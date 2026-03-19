import { RepositoryGithubGateway } from '../../domain/gateways/repository-github.gateway';
import { Repository } from '../../domain/models/repository.models';
import { getRepositoriesUseCase } from '../use-cases/get-repositories.use-case';

import { BadRequestError } from '@core/domain/errors/bad-request.error';
import { NotFoundError } from '@core/domain/errors/not-found.error';
import { getGitProviderByIdUseCase } from '@features/git-providers/application/use-cases/get-git-provider-by-id.use-case';
import { GitProviderRepository } from '@features/git-providers/domain/repositories/git-provider.repository';

/**
 * Get repositories orchestrator
 *
 * Coordinates fetching git provider credentials and listing its repositories.
 *
 * @param gitProviderRepository Git provider repository
 * @param repositoryGithubGateway Repository GitHub gateway
 * @param gitProviderId Git provider ID
 *
 * @returns List of repositories
 */
export async function getRepositoriesOrchestrator(
    gitProviderRepository: GitProviderRepository,
    repositoryGithubGateway: RepositoryGithubGateway,
    gitProviderId: string,
): Promise<Repository[]> {
    const gitProvider = await getGitProviderByIdUseCase(gitProviderRepository, gitProviderId);

    if (!gitProvider) {
        throw new NotFoundError(`Git provider with ID '${gitProviderId}' not found`);
    }

    if (gitProvider.status !== 'active') {
        throw new BadRequestError(`Git provider '${gitProvider.name}' is not active`);
    }

    if (!gitProvider.installationId) {
        throw new BadRequestError(`Git provider '${gitProvider.name}' has no installation ID`);
    }

    return getRepositoriesUseCase(
        repositoryGithubGateway,
        {
            appId: gitProvider.externalId,
            privateKey: gitProvider.privateKey,
            clientId: gitProvider.clientId,
            clientSecret: gitProvider.clientSecret,
            installationId: gitProvider.installationId,
        },
        gitProviderId,
    );
}
