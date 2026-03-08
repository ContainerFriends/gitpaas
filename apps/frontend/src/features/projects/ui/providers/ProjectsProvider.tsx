import { ReactNode, useCallback } from 'react';

import { Project } from '../../domain/models/projects.models';
import { ProjectsContext, ProjectsContextValue } from '../context/ProjectsContext';
import { useProjectsState } from '../hooks/useProjectsState';

// Mock data - in a real app this would come from an API
const mockProjects: Project[] = [
    { id: '1', name: 'frontend-app', servicesCount: 3, createdAt: '2024-01-15' },
    { id: '2', name: 'api-gateway', servicesCount: 1, createdAt: '2024-02-03' },
    { id: '3', name: 'landing-page', servicesCount: 2, createdAt: '2024-01-28' },
    { id: '4', name: 'worker-service', servicesCount: 4, createdAt: '2024-03-12' },
    { id: '5', name: 'docs-site', servicesCount: 1, createdAt: '2024-02-20' },
    { id: '6', name: 'admin-panel', servicesCount: 2, createdAt: '2024-03-05' },
    { id: '7', name: 'auth-service', servicesCount: 3, createdAt: '2024-01-10' },
    { id: '8', name: 'cdn-proxy', servicesCount: 1, createdAt: '2024-02-15' },
];

interface ProjectsProviderProps {
    children: ReactNode;
}

/**
 * Projects provider
 */
export function ProjectsProvider({ children }: ProjectsProviderProps): ReactNode {
    const { state, setLoading, setProjects, setError } = useProjectsState();

    /**
     * Load projects
     */
    const loadProjects = useCallback(async () => {
        setLoading(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));

            // In real app: const response = await projectsApi.getAll();
            setProjects(mockProjects);
        } catch {
            setError('Failed to load projects');
        }
    }, [setLoading, setProjects, setError]);

    const contextValue: ProjectsContextValue = {
        projects: state.projects,
        filter: state.filter,
        loading: state.loading,
        error: state.error,
        filteredProjects: state.filteredProjects,
        loadProjects,
    };

    return <ProjectsContext.Provider value={contextValue}>{children}</ProjectsContext.Provider>;
}
