export type ServiceType = 'docker_compose';

/**
 * Service model
 */
export interface Service {
    id: string;
    name: string;
    type: ServiceType;
    repositoryId: string;
    branch: string;
    projectId: string;
    createdAt: string;
    updatedAt: string;
}
