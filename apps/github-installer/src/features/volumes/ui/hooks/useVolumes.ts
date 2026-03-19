import { useContext } from 'react';

import { VolumesContext, VolumesContextValue } from '../context/VolumesContext';

/**
 * Use volumes hook.
 */
export function useVolumes(): VolumesContextValue {
    const context = useContext(VolumesContext);

    if (context === undefined) {
        throw new Error('useVolumes must be used within a VolumesProvider');
    }

    return context;
}
