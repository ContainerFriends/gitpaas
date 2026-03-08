/* eslint-disable no-secrets/no-secrets */
/* eslint-disable pii/no-phone-number */
import type { CreateServiceOptions } from 'dockerode';

import { docker, pullImage } from '../services/docker';

/**
 * Initialize Postgres service
 */
export const initializePostgres = async () => {
    const imageName = 'postgres:16';
    const containerName = 'gitpaas-postgres';
    const settings: CreateServiceOptions = {
        Name: containerName,
        TaskTemplate: {
            ContainerSpec: {
                Image: imageName,
                Env: ['POSTGRES_USER=gitpaas', 'POSTGRES_DB=gitpaas', 'POSTGRES_PASSWORD=amukds4wi9001583845717ad2'],
                Mounts: [
                    {
                        Type: 'volume',
                        Source: 'gitpaas-postgres',
                        Target: '/var/lib/postgresql/data',
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
                        TargetPort: 5432,
                        PublishedPort: 5432,
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
        console.log('✅ Postgres started');
    } catch {
        try {
            await docker.createService(settings);
        } catch (error: any) {
            if (error?.statusCode !== 409) {
                throw error;
            }
            console.log('➡️ Postgres service already exists, continuing...');
        }
        console.log('➡️ Postgres tot found: starting...');
    }
};
