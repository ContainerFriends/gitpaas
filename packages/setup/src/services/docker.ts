import Dockerode from 'dockerode';
import Docker from 'dockerode';

import { spawnAsync } from '../utils/spawn-async';

interface RegistryAuth {
    username: string;
    password: string;
    registryUrl: string;
}

export const DOCKER_API_VERSION = process.env.DOCKER_API_VERSION;
export const DOCKER_HOST = process.env.DOCKER_HOST;
export const DOCKER_PORT = process.env.DOCKER_PORT ? Number(process.env.DOCKER_PORT) : undefined;

export const CLEANUP_CRON_JOB = '50 23 * * *';
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

export const getRemoteDocker = async (serverId?: string | null) => {
    if (!serverId) return docker;
    const server = await findServerById(serverId);
    if (!server.sshKeyId) return docker;
    const dockerode = new Dockerode({
        host: server.ipAddress,
        port: server.port,
        username: server.username,
        protocol: 'ssh',

        sshOptions: {
            privateKey: server.sshKey?.privateKey,
        },
    });

    return dockerode;
};

export const pullImage = async (dockerImage: string, onData?: (data: any) => void, authConfig?: Partial<RegistryAuth>): Promise<void> => {
    if (!dockerImage) {
        throw new Error('Docker image not found');
    }

    if (authConfig?.username && authConfig?.password) {
        await spawnAsync('docker', ['login', authConfig.registryUrl || '', '-u', authConfig.username, '-p', authConfig.password], onData);
    }
    await spawnAsync('docker', ['pull', dockerImage], onData);
};
