import { useContext } from 'react';

import { GitProvidersContext, GitProvidersContextValue } from '../context/GitProvidersContext';

export function useGitProviders(): GitProvidersContextValue {
    const context = useContext(GitProvidersContext);

    if (context === undefined) {
        throw new Error('useGitProviders must be used within a GitProvidersProvider');
    }

    return context;
}
