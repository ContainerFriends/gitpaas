import { Container } from '../models/container.models';

/**
 * Container gateway interface
 */
export interface ContainerGateway {
    /**
     * Get all containers
     *
     * @returns List of containers
     */
    getAllContainers: () => Promise<Container[]>;

    /**
     * Remove a container
     *
     * @param id Container ID
     *
     * @returns Success status
     */
    removeContainer: (id: string) => Promise<boolean>;
}
