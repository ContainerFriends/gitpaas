import { Network, Plus, Search } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { CreateNetworkDialog } from '../components/CreateNetworkDialog';
import { NetworksTable } from '../components/NetworksTable';
import { useNetworks } from '../hooks/useNetworks';
import { NetworkFormData } from '../models/network-form.models';

import { Button } from '@shared/components/button';

/**
 * Networks list container component.
 */
export function NetworksListContainer(): ReactNode {
    // eslint-disable-next-line object-curly-newline
    const { filteredNetworks, loading, error, loadNetworks, createNetwork, removeNetwork } = useNetworks();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    /**
     * Load networks
     */
    useEffect(() => {
        loadNetworks();
    }, [loadNetworks]);

    /**
     * Handle delete network action
     */
    const handleDeleteNetwork = async (network: { id: string; name: string }) => {
        try {
            await removeNetwork(network.id);
            toast.success('Network removed successfully');
        } catch {
            toast.error('Failed to remove network');
        }
    };

    /**
     * Handle create network form submission
     */
    const handleCreateNetwork = async (data: NetworkFormData) => {
        setIsCreating(true);
        try {
            await createNetwork(data);
            setIsCreateDialogOpen(false);
            toast.success('Network created successfully');
        } catch {
            toast.error('Failed to create network');
        } finally {
            setIsCreating(false);
        }
    };

    /**
     * Handle open create project dialog
     */
    const handleOpenCreateDialog = () => {
        setIsCreateDialogOpen(true);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Networks</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">Loading networks...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Networks</h1>
                        <p className="text-sm text-destructive mt-0.5">Error: {error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (filteredNetworks.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Networks</h1>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                        <Network className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No networks found</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-sm">Get started by creating your first network to organize your work.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">Networks</h1>
                </div>
                <Button size="sm" onClick={handleOpenCreateDialog}>
                    <Plus />
                    Create network
                </Button>
            </div>

            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Filter networks..."
                    className="h-8 w-full rounded-md border border-border bg-muted/50 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                />
            </div>

            <NetworksTable networks={filteredNetworks} onDelete={handleDeleteNetwork} />

            <CreateNetworkDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onSubmit={handleCreateNetwork}
                isLoading={isCreating}
            />
        </div>
    );
}
