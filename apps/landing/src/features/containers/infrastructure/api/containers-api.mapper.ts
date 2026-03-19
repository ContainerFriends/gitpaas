import { Container } from '../../domain/models/container.models';

import { ApiContainer } from './containers-api.models';

/**
 * Containers API data mapper
 */
export const containersApiMapper = {
    toDomain: (apiResponse: ApiContainer): Container => ({
        id: apiResponse.id,
        names: apiResponse.names,
        image: apiResponse.image,
        command: apiResponse.command,
        state: apiResponse.state,
        status: apiResponse.status,
        ports: apiResponse.ports,
    }),
};
