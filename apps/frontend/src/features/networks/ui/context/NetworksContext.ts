import { createContext } from 'react';

import { Network } from '../../domain/models/network.models';

/**
 * Networks context model
 */
export interface NetworksContextValue {
    networks: Network[];
    filter: string;
    loading: boolean;
    error: string | null;
    filteredNetworks: Network[];
    selectedNetwork: Network | null;
    loadingNetwork: boolean;
    submittingNetwork: boolean;
    loadNetworks: () => Promise<void>;
    getNetworkById: (id: string) => Promise<Network | null>;
    createNetwork: (data: { name: string }) => Promise<Network>;
    removeNetwork: (id: string) => Promise<void>;
    setFilter: (filter: string) => void;
}

/**
 * Networks context
 */
export const NetworksContext = createContext<NetworksContextValue | undefined>(undefined);