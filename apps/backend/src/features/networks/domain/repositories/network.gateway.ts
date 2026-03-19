import { CreateNetworkDto } from '../dtos/create-network.dtos';
import { Network } from '../models/network.models';

/**
 * Network gateway interface
 */
export interface NetworkGateway {
    /**
     * Get all networks
     *
     * @returns List of networks
     */
    getAllNetworks: () => Promise<Network[]>;

    /**
     * Get network by ID
     *
     * @param id Network ID
     *
     * @returns Network or null if not found
     */
    getNetworkById: (id: string) => Promise<Network | null>;

    /**
     * Get network by name
     *
     * @param name Network name
     *
     * @returns Network or null if not found
     */
    getNetworkByName: (name: string) => Promise<Network | null>;

    /**
     * Create a new network
     *
     * @param createDto Network creation DTO
     *
     * @returns Created network
     */
    createNetwork: (createDto: CreateNetworkDto) => Promise<Network>;

    /**
     * Remove a network
     *
     * @param id Network ID
     *
     * @returns Success status
     */
    removeNetwork: (id: string) => Promise<boolean>;

    /**
     * Inspect network details
     *
     * @param id Network ID
     *
     * @returns Network details
     */
    inspectNetwork: (id: string) => Promise<Network>;

    /**
     * Connect container to network
     *
     * @param networkId Network ID
     * @param containerId Container ID or name
     *
     * @returns Success status
     */
    connectContainer: (networkId: string, containerId: string) => Promise<boolean>;

    /**
     * Disconnect container from network
     *
     * @param networkId Network ID
     * @param containerId Container ID or name
     *
     * @returns Success status
     */
    disconnectContainer: (networkId: string, containerId: string) => Promise<boolean>;

    /**
     * Prune unused networks
     *
     * @returns List of removed networks
     */
    pruneNetworks: () => Promise<string[]>;
}
