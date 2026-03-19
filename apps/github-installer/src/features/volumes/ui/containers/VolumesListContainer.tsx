import { HardDrive, Search } from 'lucide-react';
import { ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

import { Volume } from '../../domain/models/volume.models';
import { VolumesTable } from '../components/VolumesTable';
import { useVolumes } from '../hooks/useVolumes';

/**
 * Volumes list container component.
 */
export function VolumesListContainer(): ReactNode {
    // eslint-disable-next-line object-curly-newline
    const { filteredVolumes, loading, error, loadVolumes, removeVolume, setFilter, filter } = useVolumes();

    /**
     * Load volumes
     */
    useEffect(() => {
        loadVolumes();
    }, [loadVolumes]);

    /**
     * Handle delete volume action
     */
    const handleDeleteVolume = async (volume: Volume) => {
        try {
            await removeVolume(volume.name);
        } catch {
            toast.error('Failed to remove volume');
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Volumes</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">Loading volumes...</p>
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
                        <h1 className="text-xl font-semibold tracking-tight">Volumes</h1>
                        <p className="text-sm text-destructive mt-0.5">Error: {error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (filteredVolumes.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Volumes</h1>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                        <HardDrive className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No volumes found</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-sm">There are no volumes on the Docker instance.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">Volumes</h1>
                </div>
            </div>

            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Filter volumes..."
                    value={filter}
                    onChange={(e) => {
                        setFilter(e.target.value);
                    }}
                    className="h-8 w-full rounded-md border border-border bg-muted/50 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                />
            </div>

            <VolumesTable volumes={filteredVolumes} onDelete={handleDeleteVolume} />
        </div>
    );
}
