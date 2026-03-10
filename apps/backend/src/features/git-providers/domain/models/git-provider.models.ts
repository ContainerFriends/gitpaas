/**
 * Git provider type
 */
export type GitProviderType = 'github';

/**
 * Git provider status
 */
export type GitProviderStatus = 'pending' | 'active' | 'error';

/**
 * Git provider model
 */
export interface GitProvider {
    id: string;
    name: string;
    type: GitProviderType;
    externalId: string;
    slug: string;
    traceId: string;
    privateKey: string;
    status: GitProviderStatus;
    createdAt: Date;
    updatedAt: Date;
}
