import { CreateNetworkDto } from '../../domain/dtos/create-network.dtos';
import { Network } from '../../domain/models/network.models';

/**
 * Network Docker mapper
 */
export const networkDockerMapper = {
    toDomain: (dockerNetwork: any): Network => {
        return {
            id: dockerNetwork.Id,
            name: dockerNetwork.Name,
        };
    },
    toDockerCreateOptions: (createDto: CreateNetworkDto): any => {
        return {
            Name: createDto.name,
        };
    },
};
