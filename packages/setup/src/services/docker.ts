import Docker from 'dockerode';

import { spawnAsync } from '../utils/spawn-async';

interface RegistryAuth {
    username: string;
    password: string;
    registryUrl: string;
}

const DOCKER_API_VERSION = process.env.DOCKER_API_VERSION;
const DOCKER_HOST = process.env.DOCKER_HOST;
const DOCKER_PORT = process.env.DOCKER_PORT ? Number(process.env.DOCKER_PORT) : undefined;

export const docker = new Docker({
    ...(DOCKER_API_VERSION && {
        version: DOCKER_API_VERSION,
    }),
    ...(DOCKER_HOST && {
        host: DOCKER_HOST,
    }),
    ...(DOCKER_PORT && {
        port: DOCKER_PORT,
    }),
});

/**
 * Get a Docker instance for a remote server
 */
export const getRemoteDocker = async (serverId?: string | null) => {
    return docker;
};

/**
 * Pull a Docker image
 */
export const pullImage = async (dockerImage: string, onData?: (data: any) => void, authConfig?: Partial<RegistryAuth>): Promise<void> => {
    if (!dockerImage) {
        throw new Error('❌ Docker image not provided');
    }

    if (authConfig?.username && authConfig?.password) {
        await spawnAsync('docker', ['login', authConfig.registryUrl || '', '-u', authConfig.username, '-p', authConfig.password], onData);
    }

    await spawnAsync('docker', ['pull', dockerImage], onData);
};
