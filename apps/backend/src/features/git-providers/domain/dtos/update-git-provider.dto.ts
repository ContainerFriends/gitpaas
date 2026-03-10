import { GitProviderType } from '../models/git-provider.models';

/**
 * Update git provider DTO
 */
export interface UpdateGitProviderDto {
    id: string;
    name: string;
    type: GitProviderType;
    externalId: string;
    slug: string;
    traceId: string;
    status: 'pending' | 'active' | 'error';
    privateKey: string;
}
