/**
 * Service API model
 */
export interface ApiService {
    id: string;
    name: string;
    type: string;
    repositoryUrl: string;
    branch: string;
    projectId: string;
    createdAt: string;
    updatedAt: string;
}