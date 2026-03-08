import { MoreVertical, Calendar, Server } from 'lucide-react';
import { ReactNode, useState, useRef, useEffect } from 'react';

import { Project } from '../../domain/models/projects.models';

interface ProjectCardProps {
    project: Project;
    onEdit?: (project: Project) => void;
    onDelete?: (project: Project) => void;
}

/**
 * Project card component.
 */
export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps): ReactNode {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current
                && buttonRef.current
                && !dropdownRef.current.contains(event.target as Node)
                && !buttonRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        }

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isDropdownOpen]);

    const handleEdit = () => {
        setIsDropdownOpen(false);
        onEdit?.(project);
    };

    const handleDelete = () => {
        setIsDropdownOpen(false);
        onDelete?.(project);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                    <div>
                        <h3 className="text-sm font-semibold">{project.name}</h3>
                    </div>
                </div>
                <div className="relative">
                    <button
                        ref={buttonRef}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsDropdownOpen(!isDropdownOpen);
                        }}
                        className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <MoreVertical className="h-3.5 w-3.5" />
                    </button>

                    {isDropdownOpen && (
                        <div
                            ref={dropdownRef}
                            className="absolute right-0 top-full mt-1 w-24 bg-popover border border-border rounded-md shadow-md z-10"
                        >
                            <div className="py-1">
                                <button
                                    onClick={handleEdit}
                                    className="w-full px-3 py-1.5 text-xs text-left text-foreground hover:bg-muted transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="w-full px-3 py-1.5 text-xs text-left text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Server className="h-3 w-3" />
                    <span>{project.servicesCount} services</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Created {formatDate(project.createdAt)}</span>
                </div>
            </div>
        </div>
    );
}
