import { Service } from '../../domain/models/service.models';

import { ApiService } from './services-api.models';

/**
 * Services API data mapper
 */
export const servicesApiMapper = {
    toDomain: (apiResponse: ApiService): Service => ({
        id: apiResponse.id,
        name: apiResponse.name,
        repositoryUrl: apiResponse.repositoryUrl,
        branch: apiResponse.branch,
        projectId: apiResponse.projectId,
        createdAt: apiResponse.createdAt,
        updatedAt: apiResponse.updatedAt,
    }),
};