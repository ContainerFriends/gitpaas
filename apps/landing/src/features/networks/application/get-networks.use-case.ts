import { Network } from '../domain/models/network.models';
import { NetworksRepository } from '../domain/repositories/networks.repository';

/**
 * Get networks use case.
 *
 * @param repository Networks repository
 *
 * @return List of networks
 */
export async function getNetworksUseCase(repository: NetworksRepository): Promise<Network[]> {
    return repository.getAll();
}