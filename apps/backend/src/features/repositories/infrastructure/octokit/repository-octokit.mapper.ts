import { Repository } from '../../domain/models/repository.models';

/**
 * Repository Octokit data mapper
 */
export const repositoryOctokitMapper = {
    toDomain: (octokitRepo: any, gitProviderId: string): Repository => ({
        id: octokitRepo.id.toString(),
        name: octokitRepo.name,
        fullName: octokitRepo.full_name,
        description: octokitRepo.description || null,
        private: octokitRepo.private,
        htmlUrl: octokitRepo.html_url,
        cloneUrl: octokitRepo.clone_url,
        sshUrl: octokitRepo.ssh_url,
        defaultBranch: octokitRepo.default_branch,
        language: octokitRepo.language || null,
        gitProviderId,
    }),
};
