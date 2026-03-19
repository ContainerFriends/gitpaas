import { Network } from '../../domain/models/network.models';

import { ApiNetwork } from './networks-api.models';

/**
 * Networks API data mapper
 */
export const networksApiMapper = {
    toDomain: (apiResponse: ApiNetwork): Network => ({
        id: apiResponse.id,
        name: apiResponse.name,
    }),
};