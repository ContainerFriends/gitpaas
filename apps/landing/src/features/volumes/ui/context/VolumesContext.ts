import { createContext } from 'react';

import { Volume } from '../../domain/models/volume.models';

/**
 * Volumes context model
 */
export interface VolumesContextValue {
    volumes: Volume[];
    filter: string;
    loading: boolean;
    error: string | null;
    filteredVolumes: Volume[];
    loadVolumes: () => Promise<void>;
    removeVolume: (name: string) => Promise<void>;
    setFilter: (filter: string) => void;
}

/**
 * Volumes context
 */
export const VolumesContext = createContext<VolumesContextValue | undefined>(undefined);
