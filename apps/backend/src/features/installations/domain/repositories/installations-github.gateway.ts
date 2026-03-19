import { GitHubAppConfig } from '../models/github-app-config.models';

/**
 * Installations GitHub gateway interface
 */
export interface InstallationsGithubGateway {
    /**
     * Convert an app manifest code into a GitHub App configuration
     *
     * @param code Temporary code from GitHub app manifest flow
     *
     * @returns GitHub App configuration with credentials
     */
    convertAppManifestCode: (code: string) => Promise<GitHubAppConfig>;
}
