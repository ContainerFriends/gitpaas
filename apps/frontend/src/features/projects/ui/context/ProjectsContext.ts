import { createContext } from 'react';

import { Project } from '../../domain/models/projects.models';

/**
 * Projects context model
 */
export interface ProjectsContextValue {
    projects: Project[];
    filter: string;
    loading: boolean;
    error: string | null;
    filteredProjects: Project[];
    selectedProject: Project | null;
    loadingProject: boolean;
    submittingProject: boolean;
    loadProjects: () => Promise<void>;
    getProjectById: (id: string) => Promise<Project | null>;
    createProject: (data: { name: string }) => Promise<Project>;
    updateProject: (id: string, data: { name: string }) => Promise<Project>;
    deleteProject: (id: string) => Promise<void>;
    setFilter: (filter: string) => void;
}

/**
 * Projects context
 */
export const ProjectsContext = createContext<ProjectsContextValue | undefined>(undefined);
