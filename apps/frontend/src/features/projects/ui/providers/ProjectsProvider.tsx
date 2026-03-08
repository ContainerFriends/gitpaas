import { ReactNode, useCallback } from 'react';

import { Project } from '../../domain/models/projects.models';
import { ProjectsContext, ProjectsContextValue } from '../context/ProjectsContext';
import { useProjectsState } from '../hooks/useProjectsState';

// Mock data - in a real app this would come from an API
const mockProjects: Project[] = [
    { id: '1', name: 'frontend-app' },
    { id: '2', name: 'api-gateway' },
    { id: '3', name: 'landing-page' },
    { id: '4', name: 'worker-service' },
    { id: '5', name: 'docs-site' },
    { id: '6', name: 'admin-panel' },
    { id: '7', name: 'auth-service' },
    { id: '8', name: 'cdn-proxy' },
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
