import { ReactNode } from 'react';

import { ProjectsListContainer } from '@features/projects/ui/containers/ProjectsListContainer';
import { ProjectsProvider } from '@features/projects/ui/providers/ProjectsProvider';
import { AppLayout } from '@layout/containers/AppLayout';

/**
 * Projects page component.
 */
export function ProjectsPage(): ReactNode {
    return (
        <AppLayout>
            <ProjectsProvider>
                <ProjectsListContainer />
            </ProjectsProvider>
        </AppLayout>
    );
}
