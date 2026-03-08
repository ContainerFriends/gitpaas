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
    loadProjects: () => Promise<void>;
}

/**
 * Projects context
 */
export const ProjectsContext = createContext<ProjectsContextValue | undefined>(undefined);
