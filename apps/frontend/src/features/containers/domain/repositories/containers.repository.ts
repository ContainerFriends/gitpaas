import { Container } from '../models/container.models';

/**
 * Containers repository
 */
export interface ContainersRepository {
    /**
     * Get all containers
     *
     * @return List of containers
     */
    getAll: () => Promise<Container[]>;

    /**
     * Remove a container
     *
     * @param id Container ID
     *
     * @return Promise that resolves when removal is complete
     */
    remove: (id: string) => Promise<void>;
}
