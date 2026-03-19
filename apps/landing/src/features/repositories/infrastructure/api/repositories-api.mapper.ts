import { Branch } from '../../domain/models/branch.models';
import { Repository } from '../../domain/models/repository.models';

import { ApiBranch, ApiRepository } from './repositories-api.models';

/**
 * Repositories API data mapper
 */
export const repositoriesApiMapper = {
    toDomain: (apiResponse: ApiRepository): Repository => ({
        id: apiResponse.id,
        name: apiResponse.name,
    }),

    branchToDomain: (apiResponse: ApiBranch): Branch => ({
        name: apiResponse.name,
    }),
};
