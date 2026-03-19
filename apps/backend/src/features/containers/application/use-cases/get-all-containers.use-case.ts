import { ContainerGateway } from '../../domain/gateways/container.gateway';
import { Container } from '../../domain/models/container.models';

/**
 * Get all containers use case
 *
 * @param gateway Container gateway
 *
 * @returns List of containers
 */
export async function getAllContainersUseCase(gateway: ContainerGateway): Promise<Container[]> {
    return gateway.getAllContainers();
}
