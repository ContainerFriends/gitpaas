import { CreateGitProviderDto } from '../dtos/create-git-provider.dto';
import { UpdateGitProviderDto } from '../dtos/update-git-provider.dto';
import { GitProvider } from '../models/git-provider.models';

/**
 * Git provider repository
 */
export interface GitProviderRepository {
    /**
     * Get all git providers
     *
     * @returns List of git providers
     */
    getAll: () => Promise<GitProvider[]>;

    /**
     * Get git provider by ID
     *
     * @param id Git provider ID
     *
     * @returns Git provider or null if not found
     */
    getById: (id: string) => Promise<GitProvider | null>;

    /**
     * Create a git provider
     *
     * @param createDto Git provider creation data
     *
     * @returns Created git provider
     */
    create: (createDto: CreateGitProviderDto) => Promise<GitProvider>;

    /**
     * Update a git provider
     *
     * @param updateDto Git provider update data
     *
     * @returns Updated git provider or null if not found
     */
    update: (updateDto: UpdateGitProviderDto) => Promise<GitProvider | null>;

    /**
     * Delete a git provider
     *
     * @param id Git provider ID
     *
     * @returns Whether git provider was deleted
     */
    delete: (id: string) => Promise<boolean>;
}
