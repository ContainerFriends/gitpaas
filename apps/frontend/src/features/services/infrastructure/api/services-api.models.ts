/**
 * Service API model
 */
export interface ApiService {
    id: string;
    name: string;
    repositoryUrl: string;
    branch: string;
    projectId: string;
    createdAt: string;
    updatedAt: string;
}