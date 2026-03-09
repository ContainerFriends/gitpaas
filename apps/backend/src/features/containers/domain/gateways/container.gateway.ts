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
}
