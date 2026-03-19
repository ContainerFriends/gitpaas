/**
 * GitHub App credentials required for authenticated API operations
 */
export interface GitHubAppCredentials {
    appId: string;
    privateKey: string;
    clientId: string;
    clientSecret: string;
    installationId: string;
}
