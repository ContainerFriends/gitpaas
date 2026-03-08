import { Octokit } from '@octokit/rest';

import { ConfigurationError } from '@core/domain/errors/configuration.error';

let octokitInstance: Octokit | null = null;

/**
 * Get Octokit client instance
 */
export const getOctokitInstance = (): Octokit => {
    if (octokitInstance) return octokitInstance;

    const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

    if (!token) {
        throw new ConfigurationError('GitHub Personal Access Token is not configured. Please set GITHUB_PERSONAL_ACCESS_TOKEN environment variable.');
    }

    octokitInstance = new Octokit({ auth: token });

    return octokitInstance;
};
