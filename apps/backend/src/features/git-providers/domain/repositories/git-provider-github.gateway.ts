import { GitHubAppConfig } from '../models/github-app-config.models';

/**
 * Git provider GitHub gateway interface
 */
export interface GitProviderGithubGateway {
    /**
     * Convert an app manifest code into a GitHub App configuration
     *
     * @param code Temporary code from GitHub app manifest flow
     *
     * @returns GitHub App configuration with credentials
     */
    convertAppManifestCode: (code: string) => Promise<GitHubAppConfig>;
}
