import { useContext } from 'react';

import { ProjectsContext, ProjectsContextValue } from '../context/ProjectsContext';

/**
 * Use projects hook.
 */
export function useProjects(): ProjectsContextValue {
    const context = useContext(ProjectsContext);

    if (context === undefined) {
        throw new Error('useProjects must be used within a ProjectsProvider');
    }

    return context;
}
