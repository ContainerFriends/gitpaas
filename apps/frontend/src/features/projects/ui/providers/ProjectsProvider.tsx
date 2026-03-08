import { ReactNode, useEffect } from 'react';

import { Project } from '../../domain/models/projects.models';
import { ProjectsContext, ProjectsContextValue } from '../context/ProjectsContext';
import { useProjectsState } from '../hooks/useProjectsState';

// Mock data - in a real app this would come from an API
const mockProjects: Project[] = [
    {
        id: '1',
        name: 'frontend-app',
    },
    {
        id: '2',
        name: 'api-gateway',
    },
    {
        id: '3',
        name: 'landing-page',
    },
    {
        id: '4',
        name: 'worker-service',
    },
    {
        id: '5',
        name: 'docs-site',
    },
    {
        id: '6',
        name: 'admin-panel',
    },
    {
        id: '7',
        name: 'auth-service',
    },
    {
        id: '8',
        name: 'cdn-proxy',
    },
];

interface ProjectsProviderProps {
    children: ReactNode;
}

/**
 * Projects provider
 */
export function ProjectsProvider({ children }: ProjectsProviderProps): ReactNode {
    const { state, actions } = useProjectsState();

    // Initialize projects on mount
    useEffect(() => {
        // In a real application, this would fetch from an API
        actions.setProjects(mockProjects);
    }, [actions]);

    const contextValue: ProjectsContextValue = {
        projects: state.projects,
        filter: state.filter,
        loading: state.loading,
        error: state.error,
        filteredProjects: state.filteredProjects,
        actions,
    };

    return <ProjectsContext.Provider value={contextValue}>{children}</ProjectsContext.Provider>;
}
