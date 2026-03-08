import { Network } from '../../domain/models/network.models';
import { NetworkGateway } from '../../domain/repositories/network.gateway';
import { createNetworkUseCase } from '../use-cases/create-network.use-case';

/**
 * Create network orchestrator
 *
 * @param gateway Network gateway
 * @param data Network creation data
 *
 * @returns Created network
 */
export async function createNetworkOrchestrator(gateway: NetworkGateway, data: any): Promise<Network> {
    return createNetworkUseCase(gateway, data);
}
