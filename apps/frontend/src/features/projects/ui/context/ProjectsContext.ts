import { createContext } from 'react';

import { Project } from '../../domain/models/projects.models';

/**
 * Actions interface for projects context.
 */
export interface ProjectsContextActions {
    /**
     * Loads projects from the data source.
     */
    loadProjects: () => Promise<void>;

    /**
     * Sets the filter for the projects list.
     */
    setFilter: (filter: string) => void;

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
}

/**
 * The context value shape for projects.
 */
export interface ProjectsContextValue {
    projects: Project[];
    filter: string;
    loading: boolean;
    error: string | null;
    filteredProjects: Project[];
    loadProjects: () => Promise<void>;
}

/**
 * Projects context for sharing state across the feature.
 */
export const ProjectsContext = createContext<ProjectsContextValue | undefined>(undefined);
