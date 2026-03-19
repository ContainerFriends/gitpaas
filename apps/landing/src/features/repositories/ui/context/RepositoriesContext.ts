import { createContext } from 'react';

import { Branch } from '../../domain/models/branch.models';
import { Repository } from '../../domain/models/repository.models';

export interface RepositoriesContextValue {
    repositories: Repository[];
    loading: boolean;
    error: string | null;
    loadRepositories: (gitProviderId: string) => Promise<void>;
    branches: Branch[];
    loadingBranches: boolean;
    loadBranches: (gitProviderId: string, repositoryId: string) => Promise<void>;
}

export const RepositoriesContext = createContext<RepositoriesContextValue | undefined>(undefined);
