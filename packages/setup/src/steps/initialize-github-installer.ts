import type { CreateServiceOptions } from 'dockerode';

import { setupMode } from '../configs/environment';
import { docker, pullImage } from '../services/docker';

/**
 * Initialize Github installer service in Docker Swarm
 */
export const initializeGithubInstaller = async () => {
    const isLocal = setupMode === 'local';

    if (isLocal) {
        return;
    }

    const imageName = process.env.INSTALLER_IMAGE;

    if (!imageName) {
        throw new Error('❌ INSTALLER_IMAGE environment variable is required');
    }

    const serviceName = 'gitpaas-installer';

    const settings: CreateServiceOptions = {
        Name: serviceName,
        Labels: {
            'traefik.enable': 'true',
            'traefik.http.routers.installer.rule': 'PathPrefix(`/installer`)',
            'traefik.http.routers.installer.priority': '10',
            'traefik.http.routers.installer.entrypoints': 'web',
            'traefik.http.routers.installer.middlewares': 'redirect-to-https',
            'traefik.http.routers.installer-secure.rule': 'PathPrefix(`/installer`)',
            'traefik.http.routers.installer-secure.priority': '10',
            'traefik.http.routers.installer-secure.entrypoints': 'websecure',
            'traefik.http.routers.installer-secure.tls': 'true',
            'traefik.http.services.installer-secure.loadbalancer.server.port': '80',
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
        console.log('❌ Installer image pull failed, continuing...', error);
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
        console.log('❌ Installer service setup failed', error);
    }
};
