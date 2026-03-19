import { Volume } from '../models/volume.models';

/**
 * Volume gateway interface
 */
export interface VolumeGateway {
    /**
     * Get all volumes
     *
     * @returns List of volumes
     */
    getAllVolumes: () => Promise<Volume[]>;

    /**
     * Remove a volume
     *
     * @param name Volume name
     *
     * @returns Success status
     */
    removeVolume: (name: string) => Promise<boolean>;
}
