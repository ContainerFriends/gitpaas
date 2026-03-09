import { ReactNode, useCallback } from 'react';

import { getContainersUseCase } from '../../application/get-containers.use-case';
import { containersApiRepository } from '../../infrastructure/api/containers-api.repository';
import { ContainersContext, ContainersContextValue } from '../context/ContainersContext';
import { useContainersState } from '../hooks/useContainersState';

interface ContainersProviderProps {
    children: ReactNode;
}

/**
 * Containers provider
 */
export function ContainersProvider({ children }: ContainersProviderProps): ReactNode {
    // eslint-disable-next-line object-curly-newline
    const { state, setContainers, setFilter, setLoading, setError } = useContainersState();

    // Mock token for development - replace with Auth0 when available
    const getMockToken = useCallback(async (): Promise<string> => {
        return Promise.resolve('mock-token-for-development');
    }, []);

    /**
     * Load all containers
     */
    const loadContainers = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const token = await getMockToken();
            const containers = await getContainersUseCase(containersApiRepository(token));
            setContainers(containers);
        } catch (error) {
            setError('Failed to load containers');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [getMockToken, setLoading, setError, setContainers]);

    /**
     * Set filter for containers
     */
    const setFilterHandler = useCallback(
        (filter: string): void => {
            setFilter(filter);
        },
        [setFilter],
    );

    const contextValue: ContainersContextValue = {
        containers: state.containers,
        filter: state.filter,
        loading: state.loading,
        error: state.error,
        filteredContainers: state.filteredContainers,
        loadContainers,
        setFilter: setFilterHandler,
    };

    return <ContainersContext.Provider value={contextValue}>{children}</ContainersContext.Provider>;
}
