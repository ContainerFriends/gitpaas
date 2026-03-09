import { GitProviderType } from '../models/git-provider.models';

/**
 * Create git provider DTO.
 */
export interface CreateGitProviderDto {
    id: string;
    name: string;
    type: GitProviderType;
}
