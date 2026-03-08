/* eslint-disable pii/no-ip */

import { docker } from '../services/docker';

/**
 * Check if Docker Swarm is initialized
 *
 * @returns True if Docker Swarm is initialized, false otherwise
 */
export const dockerSwarmInitialized = async (): Promise<boolean> => {
    try {
        await docker.swarmInspect();

        return true;
    } catch {
        return false;
    }
};

/**
 * Initialize Docker Swarm service
 */
export const initializeSwarm = async (): Promise<void> => {
    const swarmInitialized = await dockerSwarmInitialized();

    if (swarmInitialized) {
        console.log('✅ Swarm is already initilized');
    } else {
        await docker.swarmInit({
            AdvertiseAddr: '127.0.0.1',
            ListenAddr: '0.0.0.0',
        });

        console.log('✅ Swarm was initilized');
    }
};
