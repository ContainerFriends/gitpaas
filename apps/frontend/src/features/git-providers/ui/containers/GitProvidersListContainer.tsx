import { GitBranch, Plus, Search } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { CreateGitProviderDialog } from '../components/CreateGitProviderDialog';
import { GitProvidersTable } from '../components/GitProvidersTable';
import { useGitProviders } from '../hooks/useGitProviders';
import { GitProviderFormData } from '../models/git-provider-form.models';

import { Button } from '@shared/components/button';

export function GitProvidersListContainer(): ReactNode {
    // eslint-disable-next-line object-curly-newline
    const { filteredGitProviders, loading, error, loadGitProviders, createGitProvider, removeGitProvider } = useGitProviders();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        loadGitProviders();
    }, [loadGitProviders]);

    const handleDeleteGitProvider = async (gitProvider: { id: string; name: string }) => {
        try {
            await removeGitProvider(gitProvider.id);
            toast.success('Git provider removed successfully');
        } catch {
            toast.error('Failed to remove git provider');
        }
    };

    const handleCreateGitProvider = async (data: GitProviderFormData) => {
        setIsCreating(true);
        try {
            await createGitProvider(data);
            setIsCreateDialogOpen(false);
            toast.success('Git provider created successfully');
        } catch {
            toast.error('Failed to create git provider');
        } finally {
            setIsCreating(false);
        }
    };

    const handleOpenCreateDialog = () => {
        setIsCreateDialogOpen(true);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Git providers</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">Loading git providers...</p>
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
                        <h1 className="text-xl font-semibold tracking-tight">Git providers</h1>
                        <p className="text-sm text-destructive mt-0.5">Error: {error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (filteredGitProviders.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Git providers</h1>
                    </div>
                    <Button size="sm" onClick={handleOpenCreateDialog}>
                        <Plus />
                        Create git provider
                    </Button>
                </div>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                        <GitBranch className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No git providers found</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                        Get started by adding your first git provider to connect your repositories.
                    </p>
                </div>
                <CreateGitProviderDialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                    onSubmit={handleCreateGitProvider}
                    isLoading={isCreating}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">Git providers</h1>
                </div>
                <Button size="sm" onClick={handleOpenCreateDialog}>
                    <Plus />
                    Create git provider
                </Button>
            </div>

            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Filter git providers..."
                    className="h-8 w-full rounded-md border border-border bg-muted/50 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                />
            </div>

            <GitProvidersTable gitProviders={filteredGitProviders} onDelete={handleDeleteGitProvider} />

            <CreateGitProviderDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onSubmit={handleCreateGitProvider}
                isLoading={isCreating}
            />
        </div>
    );
}
