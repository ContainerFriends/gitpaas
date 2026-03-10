import { RestEndpointMethodTypes } from '@octokit/rest';

import { GitHubAppConfig } from '../../domain/models/github-app-config.models';

type CreateFromManifestResponse = RestEndpointMethodTypes['apps']['createFromManifest']['response']['data'];

/**
 * GitHub App config mapper
 *
 * Transforms Octokit API responses into domain models.
 */
export const gitProviderGithuOctokitbMapper = {
    /**
     * Map Octokit app manifest conversion response to domain model
     *
     * @param data Octokit response data
     *
     * @returns GitHub App configuration
     */
    toDomain: (data: CreateFromManifestResponse): GitHubAppConfig => ({
        id: String(data.id),
        slug: data.slug ?? '',
        name: data.name,
        clientId: data.client_id,
        clientSecret: data.client_secret,
        pem: data.pem,
        webhookSecret: data.webhook_secret ?? '',
        htmlUrl: data.html_url,
    }),
};
