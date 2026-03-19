import { Network } from '../../domain/models/network.models';
import { NetworkGateway } from '../../domain/repositories/network.gateway';

/**
 * Get all networks use case
 *
 * @param gateway Network gateway
 *
 * @returns List of networks
 */
export async function getAllNetworksUseCase(gateway: NetworkGateway): Promise<Network[]> {
    return gateway.getAllNetworks();
}
