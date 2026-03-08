import { NetworkGateway } from '../../domain/repositories/network.gateway';

/**
 * Remove network use case
 *
 * @param gateway Network gateway
 * @param id Network ID
 *
 * @returns Success status
 */
export async function removeNetworkUseCase(gateway: NetworkGateway, id: string): Promise<boolean> {
    return gateway.removeNetwork(id);
}
