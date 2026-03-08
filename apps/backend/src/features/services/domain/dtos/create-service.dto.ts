/**
 * Create service DTO
 */
export interface CreateServiceDto {
    id: string;
    name: string;
    repositoryId: string;
    branch: string;
    projectId: string;
}
