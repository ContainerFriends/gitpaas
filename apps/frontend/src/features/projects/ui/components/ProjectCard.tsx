import { MoreVertical, Calendar, Server } from 'lucide-react';
import { ReactNode } from 'react';

import { Project } from '../../domain/models/projects.models';

import { Card, CardFooter, CardHeader } from '@shared/components/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@shared/components/dropdown-menu';

interface ProjectCardProps {
    project: Project;
    onEdit?: (project: Project) => void;
    onDelete?: (project: Project) => void;
}

/**
 * Project card component.
 */
export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps): ReactNode {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <Card className="min-h-[150px] flex flex-col">
            <CardHeader className="flex-grow">
                <div className="flex items-start justify-between">
                    <h3 className="text-sm font-semibold">{project.name}</h3>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <MoreVertical className="h-3.5 w-3.5" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-24">
                            <DropdownMenuItem
                                onClick={() => {
                                    onEdit?.(project);
                                }}
                            >
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    onDelete?.(project);
                                }}
                                className="text-destructive focus:text-destructive"
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardFooter>
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Server className="h-3 w-3" />
                        <span>{project.servicesCount} services</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Created {formatDate(project.createdAt)}</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
