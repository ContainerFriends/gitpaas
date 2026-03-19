import { Project } from '../../domain/models/projects.models';

import { ApiProject } from './projects-api.models';

/**
 * Projects API data mapper
 */
export const projectsApiMapper = {
    toDomain: (apiResponse: ApiProject): Project => ({
        id: apiResponse.id,
        name: apiResponse.name,
        servicesCount: 0, // Default value as it's not provided by backend yet
        createdAt: apiResponse.createdAt,
    }),
};
