import { Box, Search } from 'lucide-react';
import { ReactNode, useEffect } from 'react';

import { ContainersTable } from '../components/ContainersTable';
import { useContainers } from '../hooks/useContainers';

/**
 * Containers list container component.
 */
export function ContainersListContainer(): ReactNode {
    // eslint-disable-next-line object-curly-newline
    const { filteredContainers, loading, error, loadContainers, setFilter, filter } = useContainers();

    /**
     * Load containers
     */
    useEffect(() => {
        loadContainers();
    }, [loadContainers]);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Containers</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">Loading containers...</p>
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
                        <h1 className="text-xl font-semibold tracking-tight">Containers</h1>
                        <p className="text-sm text-destructive mt-0.5">Error: {error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (filteredContainers.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Containers</h1>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                        <Box className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No containers found</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-sm">There are no containers running on the Docker instance.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">Containers</h1>
                </div>
            </div>

            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Filter containers..."
                    value={filter}
                    onChange={(e) => {
                        setFilter(e.target.value);
                    }}
                    className="h-8 w-full rounded-md border border-border bg-muted/50 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                />
            </div>

            <ContainersTable containers={filteredContainers} />
        </div>
    );
}
