/* eslint-disable pii/no-phone-number */

import Docker from 'dockerode';

export const IS_CLOUD = process.env.IS_CLOUD === 'true';
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

// When not set, use the legacy default so 2FA remains working for users who
// enabled it before BETTER_AUTH_SECRET was introduced .
export const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET || 'better-auth-secret-123456789';
