/* eslint-disable no-secrets/no-secrets */
/* eslint-disable pii/no-phone-number */
import type { CreateServiceOptions } from 'dockerode';

import { setupMode } from '../configs/environment';
import { docker, pullImage } from '../services/docker';
import { execAsync } from '../utils/exec-async';

/**
 * Create Docker Secret for PostgreSQL password (production only)
 */
const ensurePostgresSecret = async (): Promise<void> => {
    try {
        await docker.getSecret('gitpaas_postgres_password').inspect();
        console.log('✅ PostgreSQL secret already exists');
    } catch {
        const crypto = await import('node:crypto');
        const password = crypto.randomBytes(24).toString('base64url');

        await docker.createSecret({
            Name: 'gitpaas_postgres_password',
            Data: Buffer.from(password).toString('base64'),
        });
        console.log('✅ PostgreSQL secret created');
    }
};

/**
 * Wait for PostgreSQL to be ready (uses docker exec pg_isready)
 */
export async function waitForPostgres(maxAttempts = 30): Promise<void> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            // Get the actual container name for the PostgreSQL service
            const { stdout: containerName } = await execAsync(
                "docker ps --filter 'label=com.docker.swarm.service.name=gitpaas-postgres' --format '{{.Names}}' | head -n1",
            );

            if (!containerName.trim()) {
                throw new Error('PostgreSQL container not found');
            }

            await execAsync(`docker exec ${containerName.trim()} pg_isready -h localhost -p 5432 -U postgres`);
            console.log('✅ PostgreSQL is ready');
            return;
        } catch {
            console.log(`⏳ Attempt ${attempt}/${maxAttempts}: PostgreSQL not ready yet, waiting...`);
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }

    throw new Error('PostgreSQL failed to become ready within the expected time');
}

/**
 * Initialize Postgres service in Docker Swarm
 */
export const initializePostgres = async () => {
    const isLocal = setupMode === 'local';
    const imageName = process.env.POSTGRES_IMAGE || 'postgres:18.3-alpine3.23';
    const containerName = 'gitpaas-postgres';

    if (!isLocal) {
        await ensurePostgresSecret();
    }

    const settings: CreateServiceOptions = {
        Name: containerName,
        TaskTemplate: {
            ContainerSpec: {
                Image: imageName,
                Env: [
                    'POSTGRES_USER=gitpaas',
                    'POSTGRES_DB=gitpaas',
                    ...(isLocal ? ['POSTGRES_PASSWORD=amukds4wi9001583845717ad2'] : ['POSTGRES_PASSWORD_FILE=/run/secrets/postgres_password']),
                ],
                Mounts: [
                    {
                        Type: 'volume',
                        Source: 'gitpaas-postgres',
                        Target: '/var/lib/postgresql/data',
                    },
                ],
                ...(!isLocal && {
                    Secrets: [
                        {
                            SecretName: 'gitpaas_postgres_password',
                            File: {
                                Name: '/run/secrets/postgres_password',
                                UID: '0',
                                GID: '0',
                                Mode: 0o444,
                            },
                        },
                    ],
                }),
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
        const images = await docker.listImages({ filters: { reference: [imageName] } });

        if (images.length > 0) {
            console.log('✅ Postgres image already exists');
        } else {
            await pullImage(imageName);
            console.log('✅ Postgres image pulled');
        }
    } catch (error) {
        console.log('❌ Postgres image pull failed, continuing...', error);
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
            console.log('✅ Postgres updated');
        } else {
            await docker.createService(settings);
            console.log('✅ Postgres started');
        }
    } catch (error) {
        console.log('❌ Postgres service setup failed', error);
    }
};
