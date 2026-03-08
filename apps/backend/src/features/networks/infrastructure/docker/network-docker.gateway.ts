import { CreateNetworkDto } from '../../domain/dtos/create-network.dtos';
import { Network } from '../../domain/models/network.models';
import { NetworkGateway } from '../../domain/repositories/network.gateway';

import { mapDockerNetworkToDomain } from './network-docker.mapper';

import { dockerClient } from '@core/infrastructure/docker/docker.client';
import { appLogger } from '@core/infrastructure/loggers/winston.logger';

/**
 * Docker Network Gateway implementation
 */
class NetworkDockerGateway implements NetworkGateway {
    /**
     * Get all Docker networks
     */
    async getAllNetworks(): Promise<Network[]> {
        try {
            const networks = await dockerClient.listNetworks();
            return networks.map(mapDockerNetworkToDomain);
        } catch (error) {
            appLogger.error({ message: `Failed to get networks: ${(error as Error).message}` }, 'NetworkDockerRepository');
            throw new Error(`Failed to get networks: ${(error as Error).message}`);
        }
    }

    /**
     * Get network by ID
     */
    async getNetworkById(id: string): Promise<Network | null> {
        try {
            const network = dockerClient.getNetwork(id);
            const networkInfo = await network.inspect();
            return mapDockerNetworkToDomain(networkInfo);
        } catch (error: any) {
            if (error.statusCode === 404) {
                return null;
            }
            appLogger.error({ message: `Failed to get network ${id}: ${error.message}` }, 'NetworkDockerRepository');
            throw new Error(`Failed to get network: ${error.message}`);
        }
    }

    /**
     * Get network by name
     */
    async getNetworkByName(name: string): Promise<Network | null> {
        try {
            const networks = await this.getAllNetworks();
            return networks.find((network) => network.name === name) || null;
        } catch (error) {
            appLogger.error({ message: `Failed to get network by name ${name}: ${(error as Error).message}` }, 'NetworkDockerRepository');
            throw new Error(`Failed to get network by name: ${(error as Error).message}`);
        }
    }

    /**
     * Create a new network
     */
    async createNetwork(options: CreateNetworkDto): Promise<Network> {
        try {
            const createOptions: any = {
                Name: options.name,
            };

            const result = await dockerClient.createNetwork(createOptions);
            const network = dockerClient.getNetwork(result.Id);
            const networkInfo = await network.inspect();

            return mapDockerNetworkToDomain(networkInfo);
        } catch (error) {
            appLogger.error({ message: `Failed to create network: ${(error as Error).message}` }, 'NetworkDockerRepository');
            throw new Error(`Failed to create network: ${(error as Error).message}`);
        }
    }

    /**
     * Remove a network
     */
    async removeNetwork(id: string): Promise<boolean> {
        try {
            const network = dockerClient.getNetwork(id);
            await network.remove();
            return true;
        } catch (error: any) {
            if (error.statusCode === 404) {
                return false;
            }
            appLogger.error({ message: `Failed to remove network ${id}: ${error.message}` }, 'NetworkDockerRepository');
            throw new Error(`Failed to remove network: ${error.message}`);
        }
    }

    /**
     * Inspect network details
     */
    async inspectNetwork(id: string): Promise<Network> {
        try {
            const network = dockerClient.getNetwork(id);
            const networkInfo = await network.inspect();
            return mapDockerNetworkToDomain(networkInfo);
        } catch (error: any) {
            if (error.statusCode === 404) {
                throw new Error(`Network with ID '${id}' not found`);
            }
            appLogger.error({ message: `Failed to inspect network ${id}: ${error.message}` }, 'NetworkDockerRepository');
            throw new Error(`Failed to inspect network: ${error.message}`);
        }
    }

    /**
     * Connect container to network
     */
    async connectContainer(networkId: string, containerId: string): Promise<boolean> {
        try {
            const network = dockerClient.getNetwork(networkId);
            await network.connect({ Container: containerId });
            return true;
        } catch (error: any) {
            appLogger.error(
                {
                    message: `Failed to connect container ${containerId} to network ${networkId}: ${error.message}`,
                },
                'NetworkDockerRepository',
            );
            throw new Error(`Failed to connect container to network: ${error.message}`);
        }
    }

    /**
     * Disconnect container from network
     */
    async disconnectContainer(networkId: string, containerId: string): Promise<boolean> {
        try {
            const network = dockerClient.getNetwork(networkId);
            await network.disconnect({ Container: containerId });
            return true;
        } catch (error: any) {
            appLogger.error(
                {
                    message: `Failed to disconnect container ${containerId} from network ${networkId}: ${error.message}`,
                },
                'NetworkDockerRepository',
            );
            throw new Error(`Failed to disconnect container from network: ${error.message}`);
        }
    }

    /**
     * Prune unused networks
     */
    async pruneNetworks(): Promise<string[]> {
        try {
            const result = await dockerClient.pruneNetworks();
            return result.NetworksDeleted || [];
        } catch (error) {
            appLogger.error({ message: `Failed to prune networks: ${(error as Error).message}` }, 'NetworkDockerRepository');
            throw new Error(`Failed to prune networks: ${(error as Error).message}`);
        }
    }
}

/**
 * Network Docker gateway instance
 */
export const networkDockerGateway = new NetworkDockerGateway();
