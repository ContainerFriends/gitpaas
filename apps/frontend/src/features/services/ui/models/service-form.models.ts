/**
 * Service form data model
 */
export interface ServiceFormData {
    name: string;
    repositoryUrl: string;
    branch?: string;
}

/**
 * Create service form data
 */
export interface CreateServiceFormData extends ServiceFormData {
    name: string;
    repositoryUrl: string;
    branch?: string;
}

/**
 * Update service form data
 */
export interface UpdateServiceFormData {
    name?: string;
    repositoryUrl?: string;
    branch?: string;
}