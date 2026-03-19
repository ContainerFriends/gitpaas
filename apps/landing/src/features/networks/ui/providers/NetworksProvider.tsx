import { ReactNode, useCallback } from 'react';
import { toast } from 'sonner';

import { createNetworkUseCase } from '../../application/create-network.use-case';
import { getNetworkByIdUseCase } from '../../application/get-network-by-id.use-case';
import { getNetworksUseCase } from '../../application/get-networks.use-case';
import { removeNetworkUseCase } from '../../application/remove-network.use-case';
import { Network } from '../../domain/models/network.models';
import { networksApiRepository } from '../../infrastructure/api/networks-api.repository';
import { NetworksContext, NetworksContextValue } from '../context/NetworksContext';
import { useNetworksState } from '../hooks/useNetworksState';

interface NetworksProviderProps {
    children: ReactNode;
}

/**
 * Networks provider
 */
export function NetworksProvider({ children }: NetworksProviderProps): ReactNode {
    const {
        state,
        setNetworks,
        addNetwork,
        deleteNetwork,
        setSelectedNetwork,
        setLoadingNetwork,
        setSubmittingNetwork,
        setFilter,
        setLoading,
        setError,
    } = useNetworksState();

    // Mock token for development - replace with Auth0 when available
    const getMockToken = useCallback(async (): Promise<string> => {
        return Promise.resolve('mock-token-for-development');
    }, []);

    /**
     * Load all networks
     */
    const loadNetworks = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const token = await getMockToken();
            const networks = await getNetworksUseCase(networksApiRepository(token));
            setNetworks(networks);
        } catch (error) {
            setError('Failed to load networks');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [getMockToken, setLoading, setError, setNetworks]);

    /**
     * Get network by ID
     */
    const getNetworkById = useCallback(
        async (id: string): Promise<Network | null> => {
            try {
                setLoadingNetwork(true);
                setError(null);
                const token = await getMockToken();
                const network = await getNetworkByIdUseCase(networksApiRepository(token), id);
                setSelectedNetwork(network);
                return network;
            } catch (error) {
                setError('Failed to load network');
                throw error;
            } finally {
                setLoadingNetwork(false);
            }
        },
        [getMockToken, setLoadingNetwork, setError, setSelectedNetwork],
    );

    /**
     * Create a new network
     */
    const createNetwork = useCallback(
        async (data: { name: string }): Promise<Network> => {
            try {
                setSubmittingNetwork(true);
                setError(null);
                const token = await getMockToken();
                const newNetwork = await createNetworkUseCase(networksApiRepository(token), data);
                addNetwork(newNetwork);
                toast.success('Network created successfully');
                return newNetwork;
            } catch (error) {
                setError('Failed to create network');
                toast.error('Failed to create network');
                throw error;
            } finally {
                setSubmittingNetwork(false);
            }
        },
        [getMockToken, setSubmittingNetwork, setError, addNetwork],
    );

    /**
     * Remove a network
     */
    const removeNetworkHandler = useCallback(
        async (id: string): Promise<void> => {
            try {
                setSubmittingNetwork(true);
                setError(null);
                const token = await getMockToken();
                await removeNetworkUseCase(networksApiRepository(token), id);
                deleteNetwork(id);
                toast.success('Network removed successfully');
            } catch (error) {
                setError('Failed to remove network');
                toast.error('Failed to remove network');
                throw error;
            } finally {
                setSubmittingNetwork(false);
            }
        },
        [getMockToken, setSubmittingNetwork, setError, deleteNetwork],
    );

    /**
     * Set filter for networks
     */
    const setFilterHandler = useCallback(
        (filter: string): void => {
            setFilter(filter);
        },
        [setFilter],
    );

    const contextValue: NetworksContextValue = {
        networks: state.networks,
        filter: state.filter,
        loading: state.loading,
        error: state.error,
        filteredNetworks: state.filteredNetworks,
        selectedNetwork: state.selectedNetwork,
        loadingNetwork: state.loadingNetwork,
        submittingNetwork: state.submittingNetwork,
        loadNetworks,
        getNetworkById,
        createNetwork,
        removeNetwork: removeNetworkHandler,
        setFilter: setFilterHandler,
    };

    return <NetworksContext.Provider value={contextValue}>{children}</NetworksContext.Provider>;
}