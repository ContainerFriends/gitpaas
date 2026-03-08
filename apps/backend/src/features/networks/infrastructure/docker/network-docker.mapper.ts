import { Network } from '../../domain/models/network.models';

/**
 * Maps Docker API response to domain model
 *
 * @param dockerNetwork Docker API network response
 *
 * @returns Network domain model
 */
export function mapDockerNetworkToDomain(dockerNetwork: any): Network {
    return {
        id: dockerNetwork.Id,
        name: dockerNetwork.Name,
    };
}
