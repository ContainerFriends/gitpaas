import { useContext } from 'react';

import { NetworksContext, NetworksContextValue } from '../context/NetworksContext';

/**
 * Use networks hook.
 */
export function useNetworks(): NetworksContextValue {
    const context = useContext(NetworksContext);

    if (context === undefined) {
        throw new Error('useNetworks must be used within a NetworksProvider');
    }

    return context;
}