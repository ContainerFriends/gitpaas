import { ReactNode, useCallback } from 'react';

import { getBranchesByRepositoryUseCase } from '../../application/get-branches-by-repository.use-case';
import { getRepositoriesByGitProviderUseCase } from '../../application/get-repositories-by-git-provider.use-case';
import { repositoriesApiRepository } from '../../infrastructure/api/repositories-api.repository';
import { RepositoriesContext, RepositoriesContextValue } from '../context/RepositoriesContext';
import { useRepositoriesState } from '../hooks/useRepositoriesState';

interface RepositoriesProviderProps {
    children: ReactNode;
}

/**
 * Repositories provider
 */
export function RepositoriesProvider({ children }: RepositoriesProviderProps): ReactNode {
    const { state, setRepositories, setLoading, setError, setBranches, setLoadingBranches } = useRepositoriesState();

    // Mock token for development - replace with Auth0 when available
    const getMockToken = useCallback(async (): Promise<string> => {
        return Promise.resolve('mock-token-for-development');
    }, []);

    /**
     * Load repositories by git provider ID
     */
    const loadRepositories = useCallback(
        async (gitProviderId: string): Promise<void> => {
            try {
                setLoading(true);
                setError(null);
                setBranches([]);
                const token = await getMockToken();
                const repositories = await getRepositoriesByGitProviderUseCase(repositoriesApiRepository(token), gitProviderId);
                setRepositories(repositories);
            } catch {
                setError('Failed to load repositories');
                setRepositories([]);
            } finally {
                setLoading(false);
            }
        },
        [getMockToken, setLoading, setError, setRepositories, setBranches],
    );

    /**
     * Load branches for a repository
     */
    const loadBranches = useCallback(
        async (gitProviderId: string, repositoryId: string): Promise<void> => {
            try {
                setLoadingBranches(true);
                const token = await getMockToken();
                const branches = await getBranchesByRepositoryUseCase(repositoriesApiRepository(token), gitProviderId, repositoryId);
                setBranches(branches);
            } catch {
                setBranches([]);
            } finally {
                setLoadingBranches(false);
            }
        },
        [getMockToken, setLoadingBranches, setBranches],
    );

    const contextValue: RepositoriesContextValue = {
        repositories: state.repositories,
        loading: state.loading,
        error: state.error,
        loadRepositories,
        branches: state.branches,
        loadingBranches: state.loadingBranches,
        loadBranches,
    };

    return <RepositoriesContext.Provider value={contextValue}>{children}</RepositoriesContext.Provider>;
}
