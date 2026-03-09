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
}
