import { createContext } from 'react';

import { Project } from '../../domain/models/projects.models';

/**
 * Actions interface for projects context.
 */
export interface ProjectsContextActions {
    /**
     * Sets the entire list of projects.
     */
    setProjects: (projects: Project[]) => void;

    /**
     * Adds a new project to the list.
     */
    addProject: (project: Project) => void;

    /**
     * Updates an existing project.
     */
    updateProject: (id: string, project: Partial<Project>) => void;

    /**
     * Deletes a project from the list.
     */
    deleteProject: (id: string) => void;

    /**
     * Sets the filter for the projects list.
     */
    setFilter: (filter: string) => void;

    /**
     * Sets the loading state.
     */
    setLoading: (loading: boolean) => void;

    /**
     * Sets an error message.
     */
    setError: (error: string | null) => void;
}

/**
 * The context value shape for projects.
 */
export interface ProjectsContextValue {
    /**
     * List of all projects.
     */
    projects: Project[];

    /**
     * Current filter applied to projects.
     */
    filter: string;

    /**
     * Loading state for async operations.
     */
    loading: boolean;

    /**
     * Current error message if any.
     */
    error: string | null;

    /**
     * Filtered projects based on the current filter.
     */
    filteredProjects: Project[];

    /**
     * Actions to modify the projects state.
     */
    actions: ProjectsContextActions;
}

/**
 * Projects context for sharing state across the feature.
 */
export const ProjectsContext = createContext<ProjectsContextValue | undefined>(undefined);
