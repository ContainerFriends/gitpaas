import { Volume } from '../../domain/models/volume.models';

/**
 * Volume Docker mapper
 */
export const volumeDockerMapper = {
    /**
     * Maps Docker API volume info to domain model
     *
     * @param dockerVolume Docker API volume info
     *
     * @returns Volume domain model
     */
    toDomain: (dockerVolume: any): Volume => ({
        name: dockerVolume.Name,
        driver: dockerVolume.Driver,
        mountpoint: dockerVolume.Mountpoint,
        scope: dockerVolume.Scope,
        createdAt: dockerVolume.CreatedAt,
    }),
};
