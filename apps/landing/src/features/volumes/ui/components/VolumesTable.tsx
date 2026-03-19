import { Trash2 } from 'lucide-react';
import { ReactNode } from 'react';

import { Volume } from '../../domain/models/volume.models';

import { Button } from '@shared/components/button';
import { Card } from '@shared/components/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/components/table';

interface VolumesTableProps {
    volumes: Volume[];
    onDelete?: (volume: Volume) => void;
}

/**
 * Volumes table component.
 */
export function VolumesTable({ volumes, onDelete }: VolumesTableProps): ReactNode {
    return (
        <Card className="cursor-default hover:border-border">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Name</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Scope</TableHead>
                        <TableHead>Mountpoint</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {volumes.map((volume) => (
                        <TableRow key={volume.name} className="hover:bg-transparent">
                            <TableCell className="font-medium">{volume.name}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">{volume.driver}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">{volume.scope}</TableCell>
                            <TableCell className="text-muted-foreground text-sm max-w-[300px] truncate">{volume.mountpoint}</TableCell>
                            <TableCell className="text-right">
                                {onDelete && (
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => {
                                            onDelete(volume);
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
