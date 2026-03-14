import { ContainerGateway } from '../../domain/gateways/container.gateway';
import { removeContainerUseCase } from '../use-cases/remove-container.use-case';

/**
 * Remove container orchestrator
 *
 * @param gateway Container gateway
 * @param id Container ID
 *
 * @returns Success status
 */
export async function removeContainerOrchestrator(gateway: ContainerGateway, id: string): Promise<boolean> {
    return removeContainerUseCase(gateway, id);
}
