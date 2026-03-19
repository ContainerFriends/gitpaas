import { useContext } from 'react';

import { ContainersContext, ContainersContextValue } from '../context/ContainersContext';

/**
 * Use containers hook.
 */
export function useContainers(): ContainersContextValue {
    const context = useContext(ContainersContext);

    if (context === undefined) {
        throw new Error('useContainers must be used within a ContainersProvider');
    }

    return context;
}
