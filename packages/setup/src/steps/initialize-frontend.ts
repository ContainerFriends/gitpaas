import type { CreateServiceOptions } from 'dockerode';

import { setupMode } from '../configs/environment';
import { docker, pullImage } from '../services/docker';

/**
 * Initialize Frontend service in Docker Swarm
 */
export const initializeFrontend = async () => {
    const isLocal = setupMode === 'local';

    if (isLocal) {
        console.log('⏭️ Skipping frontend service (local mode)');
        return;
    }

    const imageName = process.env.FRONTEND_IMAGE;

    if (!imageName) {
        throw new Error('❌ FRONTEND_IMAGE environment variable is required');
    }

    const serviceName = 'gitpaas-frontend';

    const settings: CreateServiceOptions = {
        Name: serviceName,
        Labels: {
            'traefik.enable': 'true',
            'traefik.http.routers.frontend.rule': 'PathPrefix(`/`)',
            'traefik.http.routers.frontend.priority': '1',
            'traefik.http.routers.frontend.entrypoints': 'web',
            'traefik.http.routers.frontend.middlewares': 'redirect-to-https',
            'traefik.http.routers.frontend-secure.rule': 'PathPrefix(`/`)',
            'traefik.http.routers.frontend-secure.priority': '1',
            'traefik.http.routers.frontend-secure.entrypoints': 'websecure',
            'traefik.http.routers.frontend-secure.tls': 'true',
            'traefik.http.services.frontend-secure.loadbalancer.server.port': '80',
        },
        TaskTemplate: {
            ContainerSpec: {
                Image: imageName,
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
        console.log('❌ Frontend image pull failed, continuing...', error);
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
        console.log('❌ Frontend service setup failed', error);
    }
};
