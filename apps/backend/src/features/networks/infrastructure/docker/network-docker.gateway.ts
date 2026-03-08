import { CreateNetworkDto } from '../../domain/dtos/create-network.dtos';
import { Network } from '../../domain/models/network.models';
import { NetworkGateway } from '../../domain/repositories/network.gateway';

import { networkDockerMapper } from './network-docker.mapper';

import { DockerError, DockerErrorType } from '@core/domain/errors/docker.error';
import { dockerClient } from '@core/infrastructure/docker/docker.client';

/**
 * Network Docker gateway
 */
export const networkDockerGateway: NetworkGateway = {
    getAllNetworks: async (): Promise<Network[]> => {
        try {
            const networks = await dockerClient.listNetworks();

            return networks.map(networkDockerMapper.toDomain);
        } catch (error) {
            throw new DockerError(`Failed to get networks: ${(error as Error).message}`, DockerErrorType.API_ERROR);
        }
    },
    getNetworkById: async (id: string): Promise<Network | null> => {
        try {
            const network = dockerClient.getNetwork(id);
            const networkInfo = await network.inspect();

            return networkDockerMapper.toDomain(networkInfo);
        } catch (error: any) {
            if (error.statusCode === 404) {
                return null;
            }
            throw new DockerError(`Failed to get network ${id}: ${error.message}`, DockerErrorType.API_ERROR);
        }
    },
    getNetworkByName: async (name: string): Promise<Network | null> => {
        try {
            const networks = await networkDockerGateway.getAllNetworks();

            return networks.find((network) => network.name === name) || null;
        } catch (error) {
            throw new DockerError(`Failed to get network by name ${name}: ${(error as Error).message}`, DockerErrorType.API_ERROR);
        }
    },
    createNetwork: async (createDto: CreateNetworkDto): Promise<Network> => {
        try {
            const createOptions = networkDockerMapper.toDockerCreateOptions(createDto);

            const result = await dockerClient.createNetwork(createOptions);
            const network = dockerClient.getNetwork(result.id);
            const networkInfo = await network.inspect();

            return networkDockerMapper.toDomain(networkInfo);
        } catch (error) {
            throw new DockerError(`Failed to create network: ${(error as Error).message}`, DockerErrorType.API_ERROR);
        }
    },
    removeNetwork: async (id: string): Promise<boolean> => {
        try {
            const network = dockerClient.getNetwork(id);
            await network.remove();
            return true;
        } catch (error: any) {
            if (error.statusCode === 404) {
                return false;
            }
            throw new DockerError(`Failed to remove network ${id}: ${error.message}`, DockerErrorType.API_ERROR);
        }
    },
    inspectNetwork: async (id: string): Promise<Network> => {
        try {
            const network = dockerClient.getNetwork(id);
            const networkInfo = await network.inspect();
            return networkDockerMapper.toDomain(networkInfo);
        } catch (error: any) {
            if (error.statusCode === 404) {
                throw new DockerError(`Network with ID '${id}' not found`, DockerErrorType.NETWORK_NOT_FOUND);
            }
            throw new DockerError(`Failed to inspect network ${id}: ${error.message}`, DockerErrorType.API_ERROR);
        }
    },
    connectContainer: async (networkId: string, containerId: string): Promise<boolean> => {
        try {
            const network = dockerClient.getNetwork(networkId);
            await network.connect({ Container: containerId });
            return true;
        } catch (error: any) {
            throw new DockerError(
                `Failed to connect container ${containerId} to network ${networkId}: ${error.message}`,
                DockerErrorType.CONTAINER_CONNECTION_ERROR,
            );
        }
    },
    disconnectContainer: async (networkId: string, containerId: string): Promise<boolean> => {
        try {
            const network = dockerClient.getNetwork(networkId);
            await network.disconnect({ Container: containerId });
            return true;
        } catch (error: any) {
            throw new DockerError(
                `Failed to disconnect container ${containerId} from network ${networkId}: ${error.message}`,
                DockerErrorType.CONTAINER_CONNECTION_ERROR,
            );
        }
    },
    pruneNetworks: async (): Promise<string[]> => {
        try {
            const result = await dockerClient.pruneNetworks();
            return result.NetworksDeleted || [];
        } catch (error) {
            throw new DockerError(`Failed to prune networks: ${(error as Error).message}`, DockerErrorType.API_ERROR);
        }
    },
};
