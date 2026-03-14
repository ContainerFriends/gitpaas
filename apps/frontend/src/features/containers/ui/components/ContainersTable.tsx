import { Trash2 } from 'lucide-react';
import { ReactNode } from 'react';

import { Container } from '../../domain/models/container.models';

import { Badge } from '@shared/components/badge';
import { Button } from '@shared/components/button';
import { Card } from '@shared/components/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/components/table';

interface ContainersTableProps {
    containers: Container[];
    onDelete?: (container: Container) => void;
}

/**
 * Containers table component.
 */
export function ContainersTable({ containers, onDelete }: ContainersTableProps): ReactNode {
    return (
        <Card className="cursor-default hover:border-border">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Name</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>State</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {containers.map((container) => (
                        <TableRow key={container.id} className="hover:bg-transparent">
                            <TableCell className="font-medium">{container.names[0]?.replace(/^\//, '')}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">{container.image}</TableCell>
                            <TableCell>
                                <Badge variant={container.state === 'running' ? 'default' : 'secondary'}>{container.state}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">{container.status}</TableCell>
                            <TableCell className="text-right">
                                {onDelete && (
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => {
                                            onDelete(container);
                                        }}
                                    >
                                        <Trash2 />
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
