import { Trash2 } from 'lucide-react';
import { ReactNode } from 'react';
import { FaGithub } from 'react-icons/fa6';

import { GitProvider, GitProviderType } from '../../domain/models/git-provider.models';

import { Button } from '@shared/components/button';
import { Card } from '@shared/components/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/components/table';

interface GitProvidersTableProps {
    gitProviders: GitProvider[];
    onDelete?: (gitProvider: GitProvider) => void;
}

const providerTypeIcons: Record<GitProviderType, ReactNode> = {
    github: <FaGithub className="h-4 w-4" />,
};

export function GitProvidersTable({ gitProviders, onDelete }: GitProvidersTableProps): ReactNode {
    return (
        <Card className="cursor-default hover:border-border">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {gitProviders.map((gitProvider) => (
                        <TableRow key={gitProvider.id} className="hover:bg-transparent">
                            <TableCell className="font-medium">
                                <span className="flex items-center gap-2">
                                    {providerTypeIcons[gitProvider.type]}
                                    {gitProvider.name}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                {onDelete && (
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => {
                                            onDelete(gitProvider);
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
