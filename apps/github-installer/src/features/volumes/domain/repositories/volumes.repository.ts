import { Volume } from '../models/volume.models';

/**
 * Volumes repository
 */
export interface VolumesRepository {
    /**
     * Get all volumes
     *
     * @return List of volumes
     */
    getAll: () => Promise<Volume[]>;

    /**
     * Remove a volume
     *
     * @param name Volume name
     *
     * @return Promise that resolves when removal is complete
     */
    remove: (name: string) => Promise<void>;
}
