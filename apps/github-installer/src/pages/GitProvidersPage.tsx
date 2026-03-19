import { ReactNode } from 'react';

import { GitProvidersListContainer } from '@features/git-providers/ui/containers/GitProvidersListContainer';
import { GitProvidersProvider } from '@features/git-providers/ui/providers/GitProvidersProvider';
import { AppLayout } from '@layout/containers/AppLayout';

/**
 * Git Providers page component.
 */
export function GitProvidersPage(): ReactNode {
    return (
        <AppLayout>
            <GitProvidersProvider>
                <GitProvidersListContainer />
            </GitProvidersProvider>
        </AppLayout>
    );
}
