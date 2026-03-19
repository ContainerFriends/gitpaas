import { ContainerGateway } from '../../domain/gateways/container.gateway';

/**
 * Remove container use case
 *
 * @param gateway Container gateway
 * @param id Container ID
 *
 * @returns Success status
 */
export async function removeContainerUseCase(gateway: ContainerGateway, id: string): Promise<boolean> {
    return gateway.removeContainer(id);
}
