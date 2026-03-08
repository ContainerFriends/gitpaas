/**
 * Create service DTO
 */
export interface CreateServiceDto {
    name: string;
    repositoryUrl: string;
    branch?: string;
    projectId: string;
}