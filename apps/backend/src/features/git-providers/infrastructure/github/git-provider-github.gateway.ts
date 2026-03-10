import { GitHubAppConfig } from '../../domain/models/github-app-config.models';
import { GitProviderGithubGateway } from '../../domain/repositories/git-provider-github.gateway';

import { gitProviderGithubMapper } from './git-provider-github.mapper';

import { GitHubError, GitHubErrorType } from '@core/domain/errors/github.error';

const GITHUB_API_BASE_URL = 'https://api.github.com';

/**
 * Git provider GitHub gateway
 *
 * Interacts with the GitHub API for app manifest operations.
 */
export const gitProviderGithubGateway: GitProviderGithubGateway = {
    convertAppManifestCode: async (code: string): Promise<GitHubAppConfig> => {
        try {
            const response = await fetch(`${GITHUB_API_BASE_URL}/app-manifests/${encodeURIComponent(code)}/conversions`, {
                method: 'POST',
                headers: { Accept: 'application/vnd.github+json' },
            });

            if (!response.ok) {
                throw new Error(`GitHub API responded with status ${response.status}`);
            }

            const data = (await response.json()) as Record<string, unknown>;

            return gitProviderGithubMapper.toDomain(data);
        } catch (error) {
            if (error instanceof GitHubError) {
                throw error;
            }

            throw new GitHubError(
                `Failed to convert app manifest code: ${(error as Error).message}`,
                GitHubErrorType.API_ERROR,
            );
        }
    },
};
