import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';

import { RepositoryGithubGateway } from '../../domain/gateways/repository-github.gateway';
import { Branch } from '../../domain/models/branch.models';
import { Repository } from '../../domain/models/repository.models';

import { repositoryOctokitMapper } from './repository-octokit.mapper';

import { GitHubError, GitHubErrorType } from '@core/domain/errors/github.error';
import { GitHubAppCredentials } from '@core/domain/models/github-app-credentials.models';

/**
 * Create an Octokit instance authenticated as a GitHub App installation
 */
async function createInstallationOctokit(credentials: GitHubAppCredentials): Promise<Octokit> {
    const auth = createAppAuth({
        appId: credentials.appId,
        privateKey: credentials.privateKey,
        clientId: credentials.clientId,
        clientSecret: credentials.clientSecret,
    });

    const installationAuthentication = await auth({
        type: 'installation',
        installationId: Number(credentials.installationId),
    });

    return new Octokit({ auth: installationAuthentication.token });
}

/**
 * Repository GitHub Octokit gateway
 *
 * Fetches repositories and branches accessible by a GitHub App installation.
 */
export const repositoryGithubOctokitGateway: RepositoryGithubGateway = {
    getRepositories: async (credentials: GitHubAppCredentials, gitProviderId: string): Promise<Repository[]> => {
        try {
            const octokit = await createInstallationOctokit(credentials);

            const { data } = await octokit.request('GET /installation/repositories');

            return data.repositories.map((repo: unknown) => repositoryOctokitMapper.toDomain(repo, gitProviderId));
        } catch (error: unknown) {
            if (error instanceof GitHubError) {
                throw error;
            }
            throw new GitHubError(`Failed to get repositories: ${(error as Error).message}`, GitHubErrorType.API_ERROR);
        }
    },

    getBranches: async (credentials: GitHubAppCredentials, owner: string, repo: string): Promise<Branch[]> => {
        try {
            const octokit = await createInstallationOctokit(credentials);

            const { data } = await octokit.rest.repos.listBranches({ owner, repo, per_page: 100 });

            return data.map((branch) => ({ name: branch.name }));
        } catch (error: unknown) {
            if (error instanceof GitHubError) {
                throw error;
            }
            throw new GitHubError(`Failed to get branches for '${owner}/${repo}': ${(error as Error).message}`, GitHubErrorType.API_ERROR);
        }
    },
};
