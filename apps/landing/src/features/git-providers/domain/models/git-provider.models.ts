export type GitProviderType = 'github';

/**
 * Git provider model
 */
export interface GitProvider {
    id: string;
    name: string;
    type: GitProviderType;
}
