import { Network } from '../../domain/models/network.models';
import { NetworkGateway } from '../../domain/repositories/network.gateway';

import { CreateNetworkDto } from '@features/networks/domain/dtos/create-network.dtos';

/**
 * Create network use case
 *
 * @param gateway Network gateway
 * @param data Network creation data
 *
 * @returns Created network
 */
export async function createNetworkUseCase(gateway: NetworkGateway, data: any): Promise<Network> {
    const createDto: CreateNetworkDto = {
        name: data.name,
    };

    return gateway.createNetwork(createDto);
}
