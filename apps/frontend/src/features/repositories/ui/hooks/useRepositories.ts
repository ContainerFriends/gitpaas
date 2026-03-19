import { useContext } from 'react';

import { RepositoriesContext, RepositoriesContextValue } from '../context/RepositoriesContext';

export function useRepositories(): RepositoriesContextValue {
    const context = useContext(RepositoriesContext);

    if (context === undefined) {
        throw new Error('useRepositories must be used within a RepositoriesProvider');
    }

    return context;
}
