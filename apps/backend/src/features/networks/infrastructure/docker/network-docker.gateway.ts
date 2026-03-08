import { CreateNetworkDto } from '../../domain/dtos/create-network.dtos';
import { Network } from '../../domain/models/network.models';
import { NetworkGateway } from '../../domain/repositories/network.gateway';

import { mapDockerNetworkToDomain } from './network-docker.mapper';

import { dockerClient } from '@core/infrastructure/docker/docker.client';
import { appLogger } from '@core/infrastructure/loggers/winston.logger';

/**
 * Network Docker gateway
 */
export const networkDockerGateway: NetworkGateway = {
    getAllNetworks: async (): Promise<Network[]> => {
        try {
            const networks = await dockerClient.listNetworks();
            return networks.map(mapDockerNetworkToDomain);
        } catch (error) {
            appLogger.error({ message: `Failed to get networks: ${(error as Error).message}` }, 'NetworkDockerGateway');
            throw new Error(`Failed to get networks: ${(error as Error).message}`);
        }
    },

    getNetworkById: async (id: string): Promise<Network | null> => {
        try {
            const network = dockerClient.getNetwork(id);
            const networkInfo = await network.inspect();
            return mapDockerNetworkToDomain(networkInfo);
        } catch (error: any) {
            if (error.statusCode === 404) {
                return null;
            }
            appLogger.error({ message: `Failed to get network ${id}: ${error.message}` }, 'NetworkDockerGateway');
            throw new Error(`Failed to get network: ${error.message}`);
        }
    },

    getNetworkByName: async (name: string): Promise<Network | null> => {
        try {
            const networks = await networkDockerGateway.getAllNetworks();
            return networks.find((network) => network.name === name) || null;
        } catch (error) {
            appLogger.error({ message: `Failed to get network by name ${name}: ${(error as Error).message}` }, 'NetworkDockerGateway');
            throw new Error(`Failed to get network by name: ${(error as Error).message}`);
        }
    },

    createNetwork: async (options: CreateNetworkDto): Promise<Network> => {
        try {
            const createOptions: any = {
                Name: options.name,
            };

            const result = await dockerClient.createNetwork(createOptions);
            const network = dockerClient.getNetwork(result.Id);
            const networkInfo = await network.inspect();

            return mapDockerNetworkToDomain(networkInfo);
        } catch (error) {
            appLogger.error({ message: `Failed to create network: ${(error as Error).message}` }, 'NetworkDockerGateway');
            throw new Error(`Failed to create network: ${(error as Error).message}`);
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
            appLogger.error({ message: `Failed to remove network ${id}: ${error.message}` }, 'NetworkDockerGateway');
            throw new Error(`Failed to remove network: ${error.message}`);
        }
    },

    inspectNetwork: async (id: string): Promise<Network> => {
        try {
            const network = dockerClient.getNetwork(id);
            const networkInfo = await network.inspect();
            return mapDockerNetworkToDomain(networkInfo);
        } catch (error: any) {
            if (error.statusCode === 404) {
                throw new Error(`Network with ID '${id}' not found`);
            }
            appLogger.error({ message: `Failed to inspect network ${id}: ${error.message}` }, 'NetworkDockerGateway');
            throw new Error(`Failed to inspect network: ${error.message}`);
        }
    },

    connectContainer: async (networkId: string, containerId: string): Promise<boolean> => {
        try {
            const network = dockerClient.getNetwork(networkId);
            await network.connect({ Container: containerId });
            return true;
        } catch (error: any) {
            appLogger.error(
                {
                    message: `Failed to connect container ${containerId} to network ${networkId}: ${error.message}`,
                },
                'NetworkDockerGateway',
            );
            throw new Error(`Failed to connect container to network: ${error.message}`);
        }
    },

    disconnectContainer: async (networkId: string, containerId: string): Promise<boolean> => {
        try {
            const network = dockerClient.getNetwork(networkId);
            await network.disconnect({ Container: containerId });
            return true;
        } catch (error: any) {
            appLogger.error(
                {
                    message: `Failed to disconnect container ${containerId} from network ${networkId}: ${error.message}`,
                },
                'NetworkDockerGateway',
            );
            throw new Error(`Failed to disconnect container from network: ${error.message}`);
        }
    },

    pruneNetworks: async (): Promise<string[]> => {
        try {
            const result = await dockerClient.pruneNetworks();
            return result.NetworksDeleted || [];
        } catch (error) {
            appLogger.error({ message: `Failed to prune networks: ${(error as Error).message}` }, 'NetworkDockerGateway');
            throw new Error(`Failed to prune networks: ${(error as Error).message}`);
        }
    },
};
