import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';

import { GitHubAppConfig } from '../../domain/models/github-app-config.models';
import { GitProviderGithubGateway } from '../../domain/repositories/git-provider-github.gateway';

import { gitProviderGithuOctokitbMapper } from './git-provider-octokit.mapper';

import { GitHubError, GitHubErrorType } from '@core/domain/errors/github.error';
import { GitHubAppCredentials } from '@core/domain/models/github-app-credentials.models';
import { getOctokitUnauthenticatedInstance } from '@core/infrastructure/octokit/client.octokit';

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

    deleteInstallations: async (credentials: GitHubAppCredentials): Promise<void> => {
        try {
            const auth = createAppAuth({
                appId: credentials.appId,
                privateKey: credentials.privateKey,
                clientId: credentials.clientId,
                clientSecret: credentials.clientSecret,
            });

            const appAuthentication = await auth({ type: 'app' });
            const octokit = new Octokit({ auth: appAuthentication.token });

            const { data: installations } = await octokit.rest.apps.listInstallations();

            await Promise.all(installations.map((installation) => octokit.rest.apps.deleteInstallation({ installation_id: installation.id })));
        } catch (error: unknown) {
            throw new GitHubError(`Failed to delete installations: ${(error as Error).message}`, GitHubErrorType.API_ERROR);
        }
    },
};
