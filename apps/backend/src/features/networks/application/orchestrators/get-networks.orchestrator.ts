import { Network } from '../../domain/models/network.models';
import { NetworkGateway } from '../../domain/repositories/network.gateway';
import { getAllNetworksUseCase } from '../use-cases/get-all-networks.use-case';

/**
 * Get networks orchestrator
 *
 * @param gateway Network gateway
 *
 * @returns List of networks
 */
export async function getNetworksOrchestrator(gateway: NetworkGateway): Promise<Network[]> {
    return getAllNetworksUseCase(gateway);
}
