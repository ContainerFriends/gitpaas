/**
 * Service API model
 */
export interface ApiService {
    id: string;
    name: string;
    type: string;
    gitProviderId: string;
    repositoryId: string;
    branch: string;
    composePath: string;
    projectId: string;
    createdAt: string;
    updatedAt: string;
}
