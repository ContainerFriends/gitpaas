import { createContext } from 'react';

import { GitProvider } from '../../domain/models/git-provider.models';
import { GitProviderFormData } from '../models/git-provider-form.models';

export interface GitProvidersContextValue {
    gitProviders: GitProvider[];
    filter: string;
    loading: boolean;
    error: string | null;
    filteredGitProviders: GitProvider[];
    selectedGitProvider: GitProvider | null;
    loadingGitProvider: boolean;
    submittingGitProvider: boolean;
    loadGitProviders: () => Promise<void>;
    getGitProviderById: (id: string) => Promise<GitProvider | null>;
    createGitProvider: (data: GitProviderFormData) => void;
    updateGitProvider: (data: { id: string; name?: string; type?: string }) => Promise<GitProvider | null>;
    removeGitProvider: (id: string) => Promise<void>;
    setFilter: (filter: string) => void;
}

export const GitProvidersContext = createContext<GitProvidersContextValue | undefined>(undefined);
