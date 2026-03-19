import { Service, ServiceType } from '../../domain/models/service.models';

import { ApiService } from './services-api.models';

/**
 * Services API data mapper
 */
export const servicesApiMapper = {
    toDomain: (apiResponse: ApiService): Service => ({
        id: apiResponse.id,
        name: apiResponse.name,
        type: apiResponse.type as ServiceType,
        gitProviderId: apiResponse.gitProviderId,
        repositoryId: apiResponse.repositoryId,
        branch: apiResponse.branch,
        composePath: apiResponse.composePath,
        projectId: apiResponse.projectId,
        createdAt: apiResponse.createdAt,
        updatedAt: apiResponse.updatedAt,
    }),
};
