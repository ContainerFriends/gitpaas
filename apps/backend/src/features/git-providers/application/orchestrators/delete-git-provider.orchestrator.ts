import { GitProviderGithubGateway } from '../../domain/repositories/git-provider-github.gateway';
import { GitProviderRepository } from '../../domain/repositories/git-provider.repository';
import { deleteGitProviderUseCase } from '../use-cases/delete-git-provider.use-case';
import { deleteGithubAppInstallationsUseCase } from '../use-cases/delete-github-app-installations.use-case';
import { getGitProviderByIdUseCase } from '../use-cases/get-git-provider-by-id.use-case';

/**
 * Delete git provider orchestrator
 *
 * Deletes the GitHub App installations first, then removes the record from the database.
 *
 * @param repository Git provider repository
 * @param gateway GitHub gateway
 * @param id Git provider ID
 *
 * @returns Whether git provider was deleted
 */
export async function deleteGitProviderOrchestrator(
    repository: GitProviderRepository,
    gateway: GitProviderGithubGateway,
    id: string,
): Promise<boolean> {
    const gitProvider = await getGitProviderByIdUseCase(repository, id);

    if (!gitProvider) {
        return false;
    }

    await deleteGithubAppInstallationsUseCase(gateway, gitProvider.externalId, gitProvider.privateKey);

    return deleteGitProviderUseCase(repository, id);
}
