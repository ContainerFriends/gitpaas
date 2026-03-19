import { Network } from '../../domain/models/network.models';
import { NetworkGateway } from '../../domain/repositories/network.gateway';

/**
 * Get network by ID use case
 *
 * @param repository Network repository
 * @param id Network ID
 *
 * @returns Network or null if not found
 */
export async function getNetworkByIdUseCase(gateway: NetworkGateway, id: string): Promise<Network | null> {
    return gateway.getNetworkById(id);
}
