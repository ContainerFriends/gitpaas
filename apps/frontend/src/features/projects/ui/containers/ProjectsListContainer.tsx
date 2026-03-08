import { Layers, Plus, Search } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';

import { Project } from '../../domain/models/projects.models';
import { CreateProjectDialog } from '../components/CreateProjectDialog';
import { ProjectCard } from '../components/ProjectCard';
import { useProjects } from '../hooks/useProjects';
import { ProjectFormData } from '../models/project-form.models';

import { Button } from '@shared/components/button';

/**
 * Projects list container component.
 */
export function ProjectsListContainer(): ReactNode {
    // eslint-disable-next-line object-curly-newline
    const { filteredProjects, filter, loading, error, loadProjects, createProject } = useProjects();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

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

    /**
     * Handle create project form submission
     */
    const handleCreateProject = async (data: ProjectFormData) => {
        setIsCreating(true);
        try {
            await createProject(data);
            await loadProjects();
            setIsCreateDialogOpen(false);
        } catch {
            console.error('Failed to create project');
        } finally {
            setIsCreating(false);
        }
    };

    /**
     * Handle open create project dialog
     */
    const handleOpenCreateDialog = () => {
        setIsCreateDialogOpen(true);
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

    if (filteredProjects.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Projects</h1>
                    </div>
                    <Button size="sm" onClick={handleOpenCreateDialog}>
                        <Plus />
                        New project
                    </Button>
                </div>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                        <Layers className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No projects found</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-sm">Get started by creating your first project to organize your work.</p>
                    <Button onClick={handleOpenCreateDialog}>
                        <Plus />
                        Create your first project
                    </Button>
                </div>

                <CreateProjectDialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                    onSubmit={handleCreateProject}
                    isLoading={isCreating}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">Projects</h1>
                </div>
                <Button size="sm" onClick={handleOpenCreateDialog}>
                    <Plus />
                    New project
                </Button>
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

            <CreateProjectDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onSubmit={handleCreateProject}
                isLoading={isCreating}
            />
        </div>
    );
}
