import { GitHubAppConfig } from '../../domain/models/github-app-config.models';
import { InstallationsGithubGateway } from '../../domain/repositories/installations-github.gateway';

import { installationsGithuOctokitbMapper } from './installations-octokit.mapper';

import { GitHubError, GitHubErrorType } from '@core/domain/errors/github.error';
import { getOctokitUnauthenticatedInstance } from '@core/infrastructure/octokit/client.octokit';

/**
 * Installations Octokit GitHub gateway
 */
export const installationsGithubOctokitGateway: InstallationsGithubGateway = {
    convertAppManifestCode: async (code: string): Promise<GitHubAppConfig> => {
        try {
            const octokit = getOctokitUnauthenticatedInstance();

            const response = await octokit.rest.apps.createFromManifest({ code });

            return installationsGithuOctokitbMapper.toDomain(response.data);
        } catch (error: unknown) {
            throw new GitHubError(`Failed to convert app manifest code: ${(error as Error).message}`, GitHubErrorType.API_ERROR);
        }
    },
};
