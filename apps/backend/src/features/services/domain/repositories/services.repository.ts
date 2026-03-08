import { CreateServiceDto } from '../dtos/create-service.dto';
import { UpdateServiceDto } from '../dtos/update-service.dto';
import { Service } from '../models/service.models';

/**
 * Services repository
 */
export interface ServicesRepository {
    /**
     * Get all services
     *
     * @return List of services
     */
    getAll: () => Promise<Service[]>;

    /**
     * Get services by project ID
     *
     * @param projectId Project ID
     *
     * @return List of services for the project
     */
    getByProjectId: (projectId: string) => Promise<Service[]>;

    /**
     * Get service by ID
     *
     * @param id Service ID
     *
     * @return Service or null if not found
     */
    getById: (id: string) => Promise<Service | null>;

    /**
     * Create a service
     *
     * @param createDto Service creation data
     *
     * @return Created service
     */
    create: (createDto: CreateServiceDto) => Promise<Service>;

    /**
     * Update a service
     *
     * @param id Service ID
     * @param updateDto Service update data
     *
     * @return Updated service
     */
    update: (id: string, updateDto: UpdateServiceDto) => Promise<Service>;

    /**
     * Delete a service
     *
     * @param id Service ID
     *
     * @return Promise that resolves when deletion is complete
     */
    delete: (id: string) => Promise<void>;
}
