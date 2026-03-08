import type { CreateServiceOptions } from 'dockerode';

import { docker, pullImage } from '../services/docker';

/**
 * Initialize Redis
 */
export const initializeRedis = async () => {
    const imageName = 'redis:7';
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
        await pullImage(imageName);

        const service = docker.getService(containerName);
        const inspect = await service.inspect();
        await service.update({
            version: Number.parseInt(inspect.Version.Index),
            ...settings,
        });
        console.log('✅ Redis Started');
    } catch {
        try {
            await docker.createService(settings);
        } catch (error: any) {
            if (error?.statusCode !== 409) {
                throw error;
            }
            console.log('Redis service already exists, continuing...');
        }
        console.log('✅ Redis Not Found: Starting');
    }
};
