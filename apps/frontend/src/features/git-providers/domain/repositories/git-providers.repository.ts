import { CreateGitProviderDto } from '../dtos/create-git-provider.dto';
import { UpdateGitProviderDto } from '../dtos/update-git-provider.dto';
import { GitProvider } from '../models/git-provider.models';

/**
 * Git providers repository
 */
export interface GitProvidersRepository {
    getAll: () => Promise<GitProvider[]>;
    getById: (id: string) => Promise<GitProvider | null>;
    create: (createDto: CreateGitProviderDto) => Promise<GitProvider>;
    update: (updateDto: UpdateGitProviderDto) => Promise<GitProvider | null>;
    remove: (id: string) => Promise<void>;
}
