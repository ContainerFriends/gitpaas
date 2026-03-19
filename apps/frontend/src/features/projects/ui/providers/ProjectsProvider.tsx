// import { useAuth0 } from '@auth0/auth0-react';
import { ReactNode, useCallback } from 'react';
import { toast } from 'sonner';

import { createProjectUseCase } from '../../application/create-project.use-case';
import { deleteProjectUseCase } from '../../application/delete-project.use-case';
import { getProjectByIdUseCase } from '../../application/get-project-by-id.use-case';
import { getProjectsUseCase } from '../../application/get-projects.use-case';
import { updateProjectUseCase } from '../../application/update-project.use-case';
import { Project } from '../../domain/models/projects.models';
import { projectsApiRepository } from '../../infrastructure/api/projects-api.repository';
import { ProjectsContext, ProjectsContextValue } from '../context/ProjectsContext';
import { useProjectsState } from '../hooks/useProjectsState';

interface ProjectsProviderProps {
    children: ReactNode;
}

/**
 * Projects provider
 */
export function ProjectsProvider({ children }: ProjectsProviderProps): ReactNode {
    // const { getAccessTokenSilently } = useAuth0();
    const {
        state,
        setProjects,
        addProject,
        updateProject,
        deleteProject,
        setSelectedProject,
        setLoadingProject,
        setSubmittingProject,
        setFilter,
        setLoading,
        setError,
    } = useProjectsState();

    // Mock token for development - replace with Auth0 when available
    const getMockToken = useCallback(async (): Promise<string> => {
        return Promise.resolve('mock-token-for-development');
    }, []);

    /**
     * Load all projects
     */
    const loadProjects = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const token = await getMockToken();
            const projects = await getProjectsUseCase(projectsApiRepository(token));
            setProjects(projects);
        } catch (error) {
            setError('Failed to load projects');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [getMockToken, setLoading, setError, setProjects]);

    /**
     * Get project by ID
     */
    const getProjectById = useCallback(
        async (id: string): Promise<Project | null> => {
            try {
                setLoadingProject(true);
                setError(null);
                const token = await getMockToken();
                const project = await getProjectByIdUseCase(projectsApiRepository(token), id);
                setSelectedProject(project);
                return project;
            } catch (error) {
                setError('Failed to load project');
                throw error;
            } finally {
                setLoadingProject(false);
            }
        },
        [getMockToken, setLoadingProject, setError, setSelectedProject],
    );

    /**
     * Create a new project
     */
    const createProject = useCallback(
        async (data: { name: string }): Promise<Project> => {
            try {
                setSubmittingProject(true);
                setError(null);
                const token = await getMockToken();
                const newProject = await createProjectUseCase(projectsApiRepository(token), data);
                addProject(newProject);
                toast.success('Project created successfully');
                return newProject;
            } catch (error) {
                setError('Failed to create project');
                toast.error('Failed to create project');
                throw error;
            } finally {
                setSubmittingProject(false);
            }
        },
        [getMockToken, setSubmittingProject, setError, addProject],
    );

    /**
     * Update an existing project
     */
    const updateProjectHandler = useCallback(
        async (id: string, data: { name: string }): Promise<Project> => {
            try {
                setSubmittingProject(true);
                setError(null);
                const token = await getMockToken();
                const updatedProject = await updateProjectUseCase(projectsApiRepository(token), id, data);
                updateProject(updatedProject);
                toast.success('Project updated successfully');
                return updatedProject;
            } catch (error) {
                setError('Failed to update project');
                toast.error('Failed to update project');
                throw error;
            } finally {
                setSubmittingProject(false);
            }
        },
        [getMockToken, setSubmittingProject, setError, updateProject],
    );

    /**
     * Delete a project
     */
    const deleteProjectHandler = useCallback(
        async (id: string): Promise<void> => {
            try {
                setSubmittingProject(true);
                setError(null);
                const token = await getMockToken();
                await deleteProjectUseCase(projectsApiRepository(token), id);
                deleteProject(id);
                toast.success('Project deleted successfully');
            } catch (error) {
                setError('Failed to delete project');
                toast.error('Failed to delete project');
                throw error;
            } finally {
                setSubmittingProject(false);
            }
        },
        [getMockToken, setSubmittingProject, setError, deleteProject],
    );

    /**
     * Set filter for projects
     */
    const setFilterHandler = useCallback(
        (filter: string): void => {
            setFilter(filter);
        },
        [setFilter],
    );

    const contextValue: ProjectsContextValue = {
        projects: state.projects,
        filter: state.filter,
        loading: state.loading,
        error: state.error,
        filteredProjects: state.filteredProjects,
        selectedProject: state.selectedProject,
        loadingProject: state.loadingProject,
        submittingProject: state.submittingProject,
        loadProjects,
        getProjectById,
        createProject,
        updateProject: updateProjectHandler,
        deleteProject: deleteProjectHandler,
        setFilter: setFilterHandler,
    };

    return <ProjectsContext.Provider value={contextValue}>{children}</ProjectsContext.Provider>;
}
