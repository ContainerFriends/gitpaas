import { CreateNetworkDto } from '../dtos/create-network.dto';
import { Network } from '../models/network.models';

/**
 * Networks repository
 */
export interface NetworksRepository {
    /**
     * Get all networks
     *
     * @return List of networks
     */
    getAll: () => Promise<Network[]>;

    /**
     * Get network by ID
     *
     * @param id Network ID
     *
     * @return Network or null if not found
     */
    getById: (id: string) => Promise<Network | null>;

    /**
     * Create a network
     *
     * @param createDto Network creation data
     *
     * @return Created network
     */
    create: (createDto: CreateNetworkDto) => Promise<Network>;

    /**
     * Remove a network
     *
     * @param id Network ID
     *
     * @return Promise that resolves when removal is complete
     */
    remove: (id: string) => Promise<void>;
}