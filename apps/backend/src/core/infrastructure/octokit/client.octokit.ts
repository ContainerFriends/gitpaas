import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';

import { ConfigurationError } from '@core/domain/errors/configuration.error';

let octokitInstance: Octokit | null = null;
let octokitUnauthenticatedInstance: Octokit | null = null;
let octokitAppInstance: Octokit | null = null;

/**
 * Get authenticated Octokit client instance
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

/**
 * Get unauthenticated Octokit client instance
 */
export const getOctokitUnauthenticatedInstance = (): Octokit => {
    if (octokitUnauthenticatedInstance) return octokitUnauthenticatedInstance;

    octokitUnauthenticatedInstance = new Octokit();

    return octokitUnauthenticatedInstance;
};

/**
 * Get Octokit client instance authenticated as a GitHub App
 */
export const getOctokitAppInstance = (appId: string, privateKey: string): Octokit => {
    if (octokitAppInstance) return octokitAppInstance;

    if (!appId || !privateKey) {
        throw new ConfigurationError(
            'GitHub App credentials are not configured. Please set GITHUB_APP_ID and GITHUB_APP_PRIVATE_KEY environment variables.',
        );
    }

    octokitAppInstance = new Octokit({
        authStrategy: createAppAuth,
        auth: { appId, privateKey: privateKey },
    });

    return octokitAppInstance;
};
