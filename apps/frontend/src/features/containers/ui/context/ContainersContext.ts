import { createContext } from 'react';

import { Container } from '../../domain/models/container.models';

/**
 * Containers context model
 */
export interface ContainersContextValue {
    containers: Container[];
    filter: string;
    loading: boolean;
    error: string | null;
    filteredContainers: Container[];
    loadContainers: () => Promise<void>;
    setFilter: (filter: string) => void;
}

/**
 * Containers context
 */
export const ContainersContext = createContext<ContainersContextValue | undefined>(undefined);
