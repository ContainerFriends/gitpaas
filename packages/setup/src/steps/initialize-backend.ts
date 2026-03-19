import type { CreateServiceOptions } from 'dockerode';

import { setupMode } from '../configs/environment';
import { docker, pullImage } from '../services/docker';

/**
 * Initialize Backend service in Docker Swarm
 */
export const initializeBackend = async () => {
    const isLocal = setupMode === 'local';

    if (isLocal) {
        console.log('⏭️ Skipping backend service (local mode)');
        return;
    }

    const imageName = process.env.BACKEND_IMAGE;

    if (!imageName) {
        throw new Error('❌ BACKEND_IMAGE environment variable is required');
    }

    const serviceName = 'gitpaas-backend';
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error('❌ DATABASE_URL is not available. Ensure PostgreSQL setup completed first.');
    }

    const secretInfo = await docker.getSecret('gitpaas_postgres_password').inspect();

    const settings: CreateServiceOptions = {
        Name: serviceName,
        Labels: {
            'traefik.enable': 'true',
            'traefik.http.middlewares.redirect-to-https.redirectscheme.scheme': 'https',
            'traefik.http.middlewares.redirect-to-https.redirectscheme.permanent': 'true',
            'traefik.http.middlewares.strip-api-prefix.stripprefix.prefixes': '/api',
            'traefik.http.routers.backend.rule': 'PathPrefix(`/api`)',
            'traefik.http.routers.backend.entrypoints': 'web',
            'traefik.http.routers.backend.middlewares': 'redirect-to-https',
            'traefik.http.routers.backend-secure.rule': 'PathPrefix(`/api`)',
            'traefik.http.routers.backend-secure.entrypoints': 'websecure',
            'traefik.http.routers.backend-secure.tls': 'true',
            'traefik.http.routers.backend-secure.middlewares': 'strip-api-prefix',
            'traefik.http.services.backend-secure.loadbalancer.server.port': '4000',
        },
        TaskTemplate: {
            ContainerSpec: {
                Image: imageName,
                Env: [
                    `DATABASE_URL=${databaseUrl}`,
                    `ADVERTISE_ADDR=${process.env.ADVERTISE_ADDR ?? ''}`,
                    'NODE_ENV=production',
                    `CORS_ORIGIN=https://${process.env.ADVERTISE_ADDR ?? ''}`,
                    `FRONTEND_URL=https://${process.env.ADVERTISE_ADDR ?? ''}`,
                    ...(process.env.RELEASE_TAG ? [`RELEASE_TAG=${process.env.RELEASE_TAG}`] : []),
                ],
                Mounts: [
                    {
                        Type: 'bind',
                        Source: '/var/run/docker.sock',
                        Target: '/var/run/docker.sock',
                    },
                    {
                        Type: 'bind',
                        Source: '/etc/gitpaas',
                        Target: '/etc/gitpaas',
                    },
                ],
                Secrets: [
                    {
                        SecretID: secretInfo.ID,
                        SecretName: 'gitpaas_postgres_password',
                        File: {
                            Name: '/run/secrets/postgres_password',
                            UID: '0',
                            GID: '0',
                            Mode: 0o444,
                        },
                    },
                ],
            },
            Networks: [{ Target: 'gitpaas-network' }],
            Placement: {
                Constraints: ['node.role==manager'],
            },
        },
        Mode: {
            Replicated: {
                Replicas: 1,
            },
        },
        UpdateConfig: {
            Parallelism: 1,
            Order: 'stop-first',
        },
    };

    try {
        await pullImage(imageName);
    } catch (error) {
        console.log('❌ Backend image pull failed, continuing...', error);
    }

    try {
        const services = await docker.listServices({ filters: { name: [serviceName] } });
        const existingService = services.find((s) => s.Spec?.Name === serviceName);

        if (existingService) {
            const service = docker.getService(serviceName);

            await service.update({
                version: Number(existingService.Version?.Index),
                ...settings,
            });
        } else {
            await docker.createService(settings);
        }
    } catch (error) {
        console.log('❌ Backend service setup failed', error);
    }
};
