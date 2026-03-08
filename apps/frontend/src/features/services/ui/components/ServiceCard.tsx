import { Button } from '@shared/components/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@shared/components/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@shared/components/dropdown-menu';
import { Badge } from '@shared/components/badge';
import { ExternalLink, GitBranch, MoreVertical, Trash } from 'lucide-react';
import { ReactNode } from 'react';

import { Service } from '../../domain/models/service.models';

interface ServiceCardProps {
    service: Service;
    onEdit?: (service: Service) => void;
    onDelete?: (serviceId: string) => void;
    onViewRepository?: (repositoryUrl: string) => void;
}

/**
 * Service Card component
 */
export function ServiceCard({ service, onEdit, onDelete, onViewRepository }: ServiceCardProps): ReactNode {
    return (
        <Card className="w-full transition-shadow duration-200 hover:shadow-md">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-base font-semibold text-gray-900 truncate pr-2">
                        {service.name}
                    </CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {onEdit && (
                                <DropdownMenuItem onClick={() => onEdit(service)}>
                                    Edit
                                </DropdownMenuItem>
                            )}
                            {onViewRepository && (
                                <DropdownMenuItem onClick={() => onViewRepository(service.repositoryUrl)}>
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    View Repository
                                </DropdownMenuItem>
                            )}
                            {onDelete && (
                                <DropdownMenuItem 
                                    onClick={() => onDelete(service.id)}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="py-3">
                <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        <a 
                            href={service.repositoryUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline truncate"
                        >
                            {service.repositoryUrl}
                        </a>
                    </div>
                    {service.branch && (
                        <div className="flex items-center">
                            <GitBranch className="w-4 h-4 mr-2 text-gray-400" />
                            <Badge variant="secondary" className="text-xs">
                                {service.branch}
                            </Badge>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="pt-3">
                <div className="flex justify-between items-center w-full text-xs text-gray-500">
                    <span>Created: {new Date(service.createdAt).toLocaleDateString()}</span>
                    <span>Updated: {new Date(service.updatedAt).toLocaleDateString()}</span>
                </div>
            </CardFooter>
        </Card>
    );
}