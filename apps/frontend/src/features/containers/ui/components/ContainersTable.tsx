import { ReactNode } from 'react';

import { Container } from '../../domain/models/container.models';

import { Badge } from '@shared/components/badge';
import { Card } from '@shared/components/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/components/table';

interface ContainersTableProps {
    containers: Container[];
}

/**
 * Containers table component.
 */
export function ContainersTable({ containers }: ContainersTableProps): ReactNode {
    return (
        <Card className="cursor-default hover:border-border">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Name</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>State</TableHead>
                        <TableHead>Status</TableHead>
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
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
