import { docker } from '../services/docker';

/**
 * Checks if Docker network is initialized
 *
 * @return True if network is initialized, false otherwise
 */
export const dockerNetworkInitialized = async (): Promise<boolean> => {
    try {
        await docker.getNetwork('gitpaas-network').inspect();
        return true;
    } catch {
        return false;
    }
};

/**
 * Initializes Docker network
 */
export const initializeNetwork = async (): Promise<void> => {
    const networkInitialized = await dockerNetworkInitialized();

    if (!networkInitialized) {
        await docker.createNetwork({
            Attachable: true,
            Name: 'gitpaas-network',
            Driver: 'overlay',
        });
    }
};
