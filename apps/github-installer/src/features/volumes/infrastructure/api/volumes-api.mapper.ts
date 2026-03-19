import { Volume } from '../../domain/models/volume.models';

import { ApiVolume } from './volumes-api.models';

/**
 * Volumes API data mapper
 */
export const volumesApiMapper = {
    toDomain: (apiResponse: ApiVolume): Volume => ({
        name: apiResponse.name,
        driver: apiResponse.driver,
        mountpoint: apiResponse.mountpoint,
        scope: apiResponse.scope,
        createdAt: apiResponse.createdAt,
    }),
};
