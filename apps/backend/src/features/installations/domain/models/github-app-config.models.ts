/**
 * GitHub App configuration model
 */
export interface GitHubAppConfig {
    id: string;
    slug: string;
    name: string;
    clientId: string;
    clientSecret: string;
    pem: string;
    webhookSecret: string;
    htmlUrl: string;
}
