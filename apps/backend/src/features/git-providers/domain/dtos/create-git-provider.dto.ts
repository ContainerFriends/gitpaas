import { GitProviderType } from '../models/git-provider.models';

/**
 * Create git provider DTO
 */
export interface CreateGitProviderDto {
    id: string;
    name: string;
    type: GitProviderType;
    externalId: string;
    slug: string;
    traceId: string;
    status: 'pending' | 'active' | 'error';
    privateKey: string;
    clientId: string;
    clientSecret: string;
}
