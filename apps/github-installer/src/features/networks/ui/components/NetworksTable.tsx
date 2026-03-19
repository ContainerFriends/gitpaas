import { Trash2 } from 'lucide-react';
import { ReactNode } from 'react';

import { Network } from '../../domain/models/network.models';

import { Button } from '@shared/components/button';
import { Card } from '@shared/components/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/components/table';

interface NetworksTableProps {
    networks: Network[];
    onDelete?: (network: Network) => void;
}

/**
 * Networks table component.
 */
export function NetworksTable({ networks, onDelete }: NetworksTableProps): ReactNode {
    return (
        <Card className="cursor-default hover:border-border">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Name</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {networks.map((network) => (
                        <TableRow key={network.id} className="hover:bg-transparent">
                            <TableCell className="font-medium">{network.name}</TableCell>
                            <TableCell className="text-muted-foreground font-mono text-sm">{network.id}</TableCell>
                            <TableCell className="text-right">
                                {onDelete && (
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => {
                                            onDelete(network);
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
