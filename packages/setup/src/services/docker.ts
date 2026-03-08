import Docker from 'dockerode';

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
