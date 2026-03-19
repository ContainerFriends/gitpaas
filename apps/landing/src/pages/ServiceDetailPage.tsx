import { ReactNode } from 'react';
import { useParams, Navigate } from 'react-router-dom';

import { GitProvidersProvider } from '@features/git-providers/ui/providers/GitProvidersProvider';
import { ProjectsProvider } from '@features/projects/ui/providers/ProjectsProvider';
import { ServiceDetailContainer } from '@features/services/ui/containers/ServiceDetailContainer';
import { ServicesProvider } from '@features/services/ui/providers/ServicesProvider';
import { AppLayout } from '@layout/containers/AppLayout';

/**
 * Service detail page component.
 */
export function ServiceDetailPage(): ReactNode {
    const { projectId, serviceId } = useParams<{ projectId: string; serviceId: string }>();

    if (!projectId || !serviceId) {
        return <Navigate to="/projects" replace />;
    }

    return (
        <AppLayout>
            <ProjectsProvider>
                <ServicesProvider>
                    <GitProvidersProvider>
                        <ServiceDetailContainer projectId={projectId} serviceId={serviceId} />
                    </GitProvidersProvider>
                </ServicesProvider>
            </ProjectsProvider>
        </AppLayout>
    );
}
