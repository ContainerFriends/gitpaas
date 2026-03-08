import { Network } from '../domain/models/network.models';
import { NetworksRepository } from '../domain/repositories/networks.repository';

/**
 * Get network by ID use case.
 *
 * @param repository Networks repository
 * @param id Network ID
 *
 * @return Network or null if not found
 */
export async function getNetworkByIdUseCase(
    repository: NetworksRepository,
    id: string,
): Promise<Network | null> {
    return repository.getById(id);
}