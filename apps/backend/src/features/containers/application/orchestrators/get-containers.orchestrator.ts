import { ContainerGateway } from '../../domain/gateways/container.gateway';
import { Container } from '../../domain/models/container.models';
import { getAllContainersUseCase } from '../use-cases/get-all-containers.use-case';

/**
 * Get containers orchestrator
 *
 * @param gateway Container gateway
 *
 * @returns List of containers
 */
export async function getContainersOrchestrator(gateway: ContainerGateway): Promise<Container[]> {
    return getAllContainersUseCase(gateway);
}
