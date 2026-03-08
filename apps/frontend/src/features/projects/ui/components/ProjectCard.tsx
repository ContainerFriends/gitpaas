import { MoreVertical, Calendar, Server } from 'lucide-react';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { Project } from '../../domain/models/projects.models';

import { Button } from '@shared/components/button';
import { Card, CardFooter, CardHeader } from '@shared/components/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@shared/components/dropdown-menu';

interface ProjectCardProps {
    project: Project;
    onEdit?: (projectId: string) => void;
    onDelete?: (projectId: string) => void;
}

/**
 * Project card component.
 */
export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps): ReactNode {
    const navigate = useNavigate();
    
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const handleCardClick = () => {
        navigate(`/projects/${project.id}/services`);
    };

    const handleDropdownClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click
    };

    return (
        <Card 
            className="min-h-[150px] flex flex-col cursor-pointer transition-shadow hover:shadow-md" 
            onClick={handleCardClick}
        >
            <CardHeader className="flex-grow">
                <div className="flex items-start justify-between">
                    <h3 className="font-semibold">{project.name}</h3>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={handleDropdownClick}>
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-24">
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit?.(project.id);
                                }}
                            >
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete?.(project.id);
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
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Server className="h-3 w-3" />
                        <span>{project.servicesCount} services</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Created {formatDate(project.createdAt)}</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
