/**
 * Update service DTO
 */
export interface UpdateServiceDto {
    name?: string;
    gitProviderId?: string;
    repositoryId?: string;
    branch?: string;
    composePath?: string;
}
