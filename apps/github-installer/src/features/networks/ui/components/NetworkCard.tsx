import { Network } from 'lucide-react';
import { ReactNode } from 'react';

import { Network as NetworkModel } from '../../domain/models/network.models';

import { Button } from '@shared/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/card';

interface NetworkCardProps {
    network: NetworkModel;
    onEdit?: (network: NetworkModel) => void;
    onDelete?: (network: NetworkModel) => void;
}

/**
 * Network card component.
 */
export function NetworkCard({ network, onEdit, onDelete }: NetworkCardProps): ReactNode {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <Network className="h-5 w-5" />
                    <span>{network.name}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 justify-end">
                    {onEdit && (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => onEdit(network)}
                        >
                            Edit
                        </Button>
                    )}
                    {onDelete && (
                        <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => onDelete(network)}
                        >
                            Delete
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}