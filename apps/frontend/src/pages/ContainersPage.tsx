import { ReactNode } from 'react';

import { ContainersListContainer } from '@features/containers/ui/containers/ContainersListContainer';
import { ContainersProvider } from '@features/containers/ui/providers/ContainersProvider';
import { AppLayout } from '@layout/containers/AppLayout';

/**
 * Containers page component.
 */
export function ContainersPage(): ReactNode {
    return (
        <AppLayout>
            <ContainersProvider>
                <ContainersListContainer />
            </ContainersProvider>
        </AppLayout>
    );
}
