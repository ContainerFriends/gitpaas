/* eslint-disable @typescript-eslint/no-explicit-any */
import { DockerNetwork } from '../../domain/models/network.models';
import { NetworkResponseDto } from '../../domain/dtos/network.dtos';

/**
 * Maps Docker API response to domain model
 *
 * @param dockerNetwork Docker API network response
 * @returns DockerNetwork domain model
 */
export function mapDockerNetworkToDomain(dockerNetwork: any): DockerNetwork {
    return {
        id: dockerNetwork.Id,
        name: dockerNetwork.Name,
    };
}

/**
 * Maps domain model to response DTO
 *
 * @param network Domain model
 * @returns NetworkResponseDto
 */
export function mapDomainToDto(network: DockerNetwork): NetworkResponseDto {
    return {
        id: network.id,
        name: network.name,
    };
}