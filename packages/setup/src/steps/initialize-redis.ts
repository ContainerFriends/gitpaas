import type { CreateServiceOptions } from 'dockerode';

import { docker, pullImage } from '../services/docker';

/**
 * Initialize Redis
 */
export const initializeRedis = async () => {
    const imageName = process.env.REDIS_IMAGE || 'redis:8.4-alpine3.22';
    const containerName = 'gitpaas-redis';
    const settings: CreateServiceOptions = {
        Name: containerName,
        TaskTemplate: {
            ContainerSpec: {
                Image: imageName,
                Mounts: [
                    {
                        Type: 'volume',
                        Source: 'gitpaas-redis',
                        Target: '/data',
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
        ...(process.env.NODE_ENV === 'development' && {
            EndpointSpec: {
                Ports: [
                    {
                        TargetPort: 6379,
                        PublishedPort: 6379,
                        Protocol: 'tcp',
                        PublishMode: 'host',
                    },
                ],
            },
        }),
    };

    try {
        const images = await docker.listImages({ filters: { reference: [imageName] } });

        if (images.length > 0) {
            console.log('✅ Redis image already exists');
        } else {
            await pullImage(imageName);
            console.log('✅ Redis image pulled');
        }
    } catch (error) {
        console.log('❌ Redis image pull failed, continuing...', error);
    }

    try {
        const services = await docker.listServices({ filters: { name: [containerName] } });
        const existingService = services.find((s) => s.Spec?.Name === containerName);

        if (existingService) {
            const service = docker.getService(containerName);

            await service.update({
                version: Number(existingService.Version?.Index),
                ...settings,
            });
            console.log('✅ Redis updated');
        } else {
            await docker.createService(settings);
            console.log('✅ Redis started');
        }
    } catch (error) {
        console.log('❌ Redis service setup failed', error);
    }
};
