export type ServiceType = 'docker_compose';

/**
 * Service model
 */
export interface Service {
    id: string;
    name: string;
    type: ServiceType;
    gitProviderId: string;
    repositoryId: string;
    branch: string;
    composePath: string;
    projectId: string;
    createdAt: string;
    updatedAt: string;
}
