import { docker } from './services/docker';

export const dockerNetworkInitialized = async () => {
    try {
        await docker.getNetwork('dokploy-network').inspect();
        return true;
    } catch {
        return false;
    }
};

export const initializeNetwork = async () => {
    const networkInitialized = await dockerNetworkInitialized();
    if (networkInitialized) {
        console.log('Network is already initilized');
    } else {
        docker.createNetwork({
            Attachable: true,
            Name: 'dokploy-network',
            Driver: 'overlay',
        });
        console.log('Network was initilized');
    }
};
