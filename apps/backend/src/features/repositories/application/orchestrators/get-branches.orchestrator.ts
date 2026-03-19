import { RepositoryGithubGateway } from '../../domain/gateways/repository-github.gateway';
import { Branch } from '../../domain/models/branch.models';
import { getBranchesUseCase } from '../use-cases/get-branches.use-case';
import { getRepositoriesUseCase } from '../use-cases/get-repositories.use-case';

import { BadRequestError } from '@core/domain/errors/bad-request.error';
import { NotFoundError } from '@core/domain/errors/not-found.error';
import { getGitProviderByIdUseCase } from '@features/git-providers/application/use-cases/get-git-provider-by-id.use-case';
import { GitProviderRepository } from '@features/git-providers/domain/repositories/git-provider.repository';

/**
 * Get branches orchestrator
 *
 * Coordinates fetching git provider credentials, resolving the repository by ID,
 * and listing its branches.
 *
 * @param gitProviderRepository Git provider repository
 * @param repositoryGithubGateway Repository GitHub gateway
 * @param gitProviderId Git provider ID
 * @param repositoryId Repository ID (GitHub numeric ID)
 *
 * @returns List of branches
 */
export async function getBranchesOrchestrator(
    gitProviderRepository: GitProviderRepository,
    repositoryGithubGateway: RepositoryGithubGateway,
    gitProviderId: string,
    repositoryId: string,
): Promise<Branch[]> {
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

    const credentials = {
        appId: gitProvider.externalId,
        privateKey: gitProvider.privateKey,
        clientId: gitProvider.clientId,
        clientSecret: gitProvider.clientSecret,
        installationId: gitProvider.installationId,
    };

    const repositories = await getRepositoriesUseCase(repositoryGithubGateway, credentials, gitProviderId);
    const repository = repositories.find((r) => r.id === repositoryId);

    if (!repository) {
        throw new NotFoundError(`Repository with ID '${repositoryId}' not found`);
    }

    const [owner, repo] = repository.fullName.split('/');

    return getBranchesUseCase(repositoryGithubGateway, credentials, owner, repo);
}
