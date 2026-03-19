import { ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';

import { InstallContainer } from '@features/install/ui/containers/InstallContainer';
import { InstallErrorContainer } from '@features/install/ui/containers/InstallErrorContainer';

/**
 * Install page component.
 */
export function InstallPage(): ReactNode {
    const [searchParams] = useSearchParams();
    const manifest = searchParams.get('manifest');

    if (!manifest) {
        return <InstallErrorContainer />;
    }

    return <InstallContainer manifest={manifest} />;
}
