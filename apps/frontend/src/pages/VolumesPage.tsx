import { ReactNode } from 'react';

import { VolumesListContainer } from '@features/volumes/ui/containers/VolumesListContainer';
import { VolumesProvider } from '@features/volumes/ui/providers/VolumesProvider';
import { AppLayout } from '@layout/containers/AppLayout';

/**
 * Volumes page component.
 */
export function VolumesPage(): ReactNode {
    return (
        <AppLayout>
            <VolumesProvider>
                <VolumesListContainer />
            </VolumesProvider>
        </AppLayout>
    );
}
