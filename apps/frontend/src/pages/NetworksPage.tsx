import { ReactNode } from 'react';

import { NetworksListContainer } from '@features/networks/ui/containers/NetworksListContainer';
import { NetworksProvider } from '@features/networks/ui/providers/NetworksProvider';
import { AppLayout } from '@layout/containers/AppLayout';

/**
 * Networks page component.
 */
export function NetworksPage(): ReactNode {
    return (
        <AppLayout>
            <NetworksProvider>
                <NetworksListContainer />
            </NetworksProvider>
        </AppLayout>
    );
}
