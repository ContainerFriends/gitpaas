import { Calendar, MoreVertical } from 'lucide-react';
import { ReactNode, MouseEvent } from 'react';

import { Service } from '../../domain/models/service.models';

import { Button } from '@shared/components/button';
import { Card, CardFooter, CardHeader } from '@shared/components/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@shared/components/dropdown-menu';

interface ServiceCardProps {
    service: Service;
    onEdit?: (serviceId: string) => void;
    onDelete?: (serviceId: string) => void;
}

/**
 * Service card component
 */
export function ServiceCard({ service, onEdit, onDelete }: ServiceCardProps): ReactNode {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const handleDropdownClick = (e: MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <Card className="min-h-[150px] flex flex-col cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader className="flex-grow">
                <div className="flex items-start justify-between">
                    <h3 className="font-semibold">{service.name}</h3>
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
                                    onEdit?.(service.id);
                                }}
                            >
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete?.(service.id);
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
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Created {formatDate(service.createdAt)}</span>
                </div>
            </CardFooter>
        </Card>
    );
}
