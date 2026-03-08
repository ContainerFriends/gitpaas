import { ReactNode } from 'react';
import { useParams, Navigate } from 'react-router-dom';

import { ProjectsProvider } from '@features/projects/ui/providers/ProjectsProvider';
import { ServicesContainer } from '@features/services/ui/containers/ServicesContainer';
import { ServicesProvider } from '@features/services/ui/providers/ServicesProvider';
import { AppLayout } from '@layout/containers/AppLayout';

/**
 * Services page component.
 */
export function ServicesPage(): ReactNode {
    const { projectId } = useParams<{ projectId: string }>();

    if (!projectId) {
        return <Navigate to="/projects" replace />;
    }

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                <ProjectsProvider>
                    <ServicesProvider>
                        <ServicesContainer projectId={projectId} />
                    </ServicesProvider>
                </ProjectsProvider>
            </div>
        </AppLayout>
    );
}
