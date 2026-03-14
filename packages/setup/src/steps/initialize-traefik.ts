import type { CreateServiceOptions } from 'dockerode';

import { paths } from '../configs/paths';
import { TRAEFIK_HTTP3_PORT, TRAEFIK_PORT, TRAEFIK_SSL_PORT, TRAEFIK_VERSION } from '../configs/traefik';
import { docker, pullImage } from '../services/docker';

/**
 * Initialize Traefik as a Docker Swarm service
 */
export const initializeTraefik = async (): Promise<void> => {
    const { MAIN_TRAEFIK_PATH, DYNAMIC_TRAEFIK_PATH } = paths();
    const imageName = `traefik:v${TRAEFIK_VERSION}`;
    const serviceName = 'gitpaas-traefik';
    const settings: CreateServiceOptions = {
        Name: serviceName,
        TaskTemplate: {
            ContainerSpec: {
                Image: imageName,
                Mounts: [
                    {
                        Type: 'bind',
                        Source: `${MAIN_TRAEFIK_PATH}/traefik.yml`,
                        Target: '/etc/traefik/traefik.yml',
                        ReadOnly: true,
                    },
                    {
                        Type: 'bind',
                        Source: DYNAMIC_TRAEFIK_PATH,
                        Target: '/etc/gitpaas/traefik/dynamic',
                        ReadOnly: true,
                    },
                    {
                        Type: 'bind',
                        Source: '/var/run/docker.sock',
                        Target: '/var/run/docker.sock',
                        ReadOnly: true,
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
        EndpointSpec: {
            Ports: [
                {
                    TargetPort: TRAEFIK_PORT,
                    PublishedPort: TRAEFIK_PORT,
                    Protocol: 'tcp',
                    PublishMode: 'host',
                },
                {
                    TargetPort: TRAEFIK_SSL_PORT,
                    PublishedPort: TRAEFIK_SSL_PORT,
                    Protocol: 'tcp',
                    PublishMode: 'host',
                },
                {
                    TargetPort: TRAEFIK_HTTP3_PORT,
                    PublishedPort: TRAEFIK_HTTP3_PORT,
                    Protocol: 'udp',
                    PublishMode: 'host',
                },
            ],
        },
    };

    try {
        await pullImage(imageName);
        console.log('✅ Traefik image pulled');
    } catch (error) {
        console.log('⏩ Traefik image pull failed, continuing...', error);
    }

    try {
        const service = docker.getService(serviceName);
        const inspect = await service.inspect();

        await service.update({
            version: Number.parseInt(inspect.Version.Index),
            ...settings,
        });
        console.log('✅ Traefik updated');
    } catch {
        try {
            await docker.createService(settings);
            console.log('✅ Traefik started');
        } catch (error: any) {
            if (error?.statusCode !== 409) {
                throw error;
            }
            console.log('⏩ Traefik service already exists, continuing...');
        }
    }
};
