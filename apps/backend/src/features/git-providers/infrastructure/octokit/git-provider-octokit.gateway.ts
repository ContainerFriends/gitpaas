import { GitHubAppConfig } from '../../domain/models/github-app-config.models';
import { GitProviderGithubGateway } from '../../domain/repositories/git-provider-github.gateway';

import { gitProviderGithuOctokitbMapper } from './git-provider-octokit.mapper';

import { GitHubError, GitHubErrorType } from '@core/domain/errors/github.error';
import { getOctokitAppInstance, getOctokitUnauthenticatedInstance } from '@core/infrastructure/octokit/client.octokit';

/**
 * Git provider GitHub gateway
 *
 * Interacts with the GitHub API for app manifest operations.
 */
export const gitProviderGithubOctokitGateway: GitProviderGithubGateway = {
    convertAppManifestCode: async (code: string): Promise<GitHubAppConfig> => {
        try {
            const octokit = getOctokitUnauthenticatedInstance();

            const response = await octokit.rest.apps.createFromManifest({ code });

            return gitProviderGithuOctokitbMapper.toDomain(response.data);
        } catch (error: unknown) {
            throw new GitHubError(`Failed to convert app manifest code: ${(error as Error).message}`, GitHubErrorType.API_ERROR);
        }
    },

    deleteInstallations: async (appId: string, privateKey: string): Promise<void> => {
        try {
            const octokit = getOctokitAppInstance(appId, privateKey);

            const { data: installations } = await octokit.rest.apps.listInstallations();

            await Promise.all(installations.map((installation) => octokit.rest.apps.deleteInstallation({ installation_id: installation.id })));
        } catch (error: unknown) {
            throw new GitHubError(`Failed to delete installations for GitHub App '${appId}': ${(error as Error).message}`, GitHubErrorType.API_ERROR);
        }
    },
};
