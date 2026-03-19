import { ReactNode, useCallback } from 'react';
import { toast } from 'sonner';

import { getVolumesUseCase } from '../../application/get-volumes.use-case';
import { removeVolumeUseCase } from '../../application/remove-volume.use-case';
import { volumesApiRepository } from '../../infrastructure/api/volumes-api.repository';
import { VolumesContext, VolumesContextValue } from '../context/VolumesContext';
import { useVolumesState } from '../hooks/useVolumesState';

interface VolumesProviderProps {
    children: ReactNode;
}

/**
 * Volumes provider
 */
export function VolumesProvider({ children }: VolumesProviderProps): ReactNode {
    // eslint-disable-next-line object-curly-newline
    const { state, setVolumes, deleteVolume, setFilter, setLoading, setError } = useVolumesState();

    // Mock token for development - replace with Auth0 when available
    const getMockToken = useCallback(async (): Promise<string> => {
        return Promise.resolve('mock-token-for-development');
    }, []);

    /**
     * Load all volumes
     */
    const loadVolumes = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const token = await getMockToken();
            const volumes = await getVolumesUseCase(volumesApiRepository(token));
            setVolumes(volumes);
        } catch (error) {
            setError('Failed to load volumes');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [getMockToken, setLoading, setError, setVolumes]);

    /**
     * Remove a volume
     */
    const removeVolumeHandler = useCallback(
        async (name: string): Promise<void> => {
            try {
                setError(null);
                const token = await getMockToken();
                await removeVolumeUseCase(volumesApiRepository(token), name);
                deleteVolume(name);
                toast.success('Volume removed successfully');
            } catch (error) {
                setError('Failed to remove volume');
                toast.error('Failed to remove volume');
                throw error;
            }
        },
        [getMockToken, setError, deleteVolume],
    );

    /**
     * Set filter for volumes
     */
    const setFilterHandler = useCallback(
        (filter: string): void => {
            setFilter(filter);
        },
        [setFilter],
    );

    const contextValue: VolumesContextValue = {
        volumes: state.volumes,
        filter: state.filter,
        loading: state.loading,
        error: state.error,
        filteredVolumes: state.filteredVolumes,
        loadVolumes,
        removeVolume: removeVolumeHandler,
        setFilter: setFilterHandler,
    };

    return <VolumesContext.Provider value={contextValue}>{children}</VolumesContext.Provider>;
}
