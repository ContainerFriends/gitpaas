import { CreateNetworkDto } from '../domain/dtos/create-network.dto';
import { Network } from '../domain/models/network.models';
import { NetworksRepository } from '../domain/repositories/networks.repository';

/**
 * Create network use case.
 *
 * @param repository Networks repository
 * @param createDto Network creation data
 *
 * @return Created network
 */
export async function createNetworkUseCase(
    repository: NetworksRepository,
    createDto: CreateNetworkDto,
): Promise<Network> {
    return repository.create(createDto);
}