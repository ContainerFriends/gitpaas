import { GitHubAppConfig } from '../../domain/models/github-app-config.models';

/**
 * GitHub App config mapper
 *
 * Transforms raw GitHub API responses into domain models.
 */
export const gitProviderGithubMapper = {
    /**
     * Map GitHub API app manifest conversion response to domain model
     *
     * @param data Raw GitHub API response
     *
     * @returns GitHub App configuration
     */
    toDomain: (data: Record<string, unknown>): GitHubAppConfig => ({
        id: String(data.id),
        slug: String(data.slug),
        name: String(data.name),
        clientId: String(data.client_id),
        clientSecret: String(data.client_secret),
        pem: String(data.pem),
        webhookSecret: String(data.webhook_secret),
        htmlUrl: String(data.html_url),
    }),
};
