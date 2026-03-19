import { GitProvider, GitProviderType } from '../../domain/models/git-provider.models';

import { ApiGitProvider } from './git-providers-api.models';

export const gitProvidersApiMapper = {
    toDomain: (apiResponse: ApiGitProvider): GitProvider => ({
        id: apiResponse.id,
        name: apiResponse.name,
        type: apiResponse.type as GitProviderType,
    }),
};
