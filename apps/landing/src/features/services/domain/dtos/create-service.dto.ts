import { ServiceType } from '../models/service.models';

/**
 * Create service DTO
 */
export interface CreateServiceDto {
    id: string;
    name: string;
    type: ServiceType;
    projectId: string;
}
