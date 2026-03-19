import Docker from 'dockerode';

/**
 * Docker client instance
 */
export const dockerClient = new Docker({
    socketPath: '/var/run/docker.sock',
});
