import { Plus, Search } from 'lucide-react';
import { ReactNode, useEffect } from 'react';

import { Project } from '../../domain/models/projects.models';
import { ProjectCard } from '../components/ProjectCard';
import { useProjects } from '../hooks/useProjects';

/**
 * Projects list container component.
 */
export function ProjectsListContainer(): ReactNode {
    // eslint-disable-next-line object-curly-newline
    const { filteredProjects, filter, loading, error, loadProjects } = useProjects();

    /**
     * Load projects
     */
    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    const handleEditProject = (project: Project) => {
        console.log('Edit project:', project);
        // TODO: Implement edit functionality
    };

    const handleDeleteProject = (project: Project) => {
        console.log('Delete project:', project);
        // TODO: Implement delete functionality
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Projects</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">Loading projects...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Projects</h1>
                        <p className="text-sm text-destructive mt-0.5">Error: {error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">Projects</h1>
                </div>
                <button className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 hover:bg-primary/90 transition-colors">
                    <Plus className="h-3.5 w-3.5" />
                    New Project
                </button>
            </div>

            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Filter projects..."
                    value={filter}
                    className="h-8 w-full rounded-md border border-border bg-muted/50 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} onEdit={handleEditProject} onDelete={handleDeleteProject} />
                ))}
            </div>
        </div>
    );
}
