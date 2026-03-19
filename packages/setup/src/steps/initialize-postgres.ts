/* eslint-disable no-secrets/no-secrets */
/* eslint-disable pii/no-phone-number */
import { hostname } from 'node:os';

import type { CreateServiceOptions } from 'dockerode';

import { setupMode } from '../configs/environment';
import { docker, pullImage } from '../services/docker';

/**
 * Create Docker Secret for PostgreSQL password (production only).
 * Also sets DATABASE_URL in process.env with the generated password.
 */
const ensurePostgresSecret = async (): Promise<string> => {
    try {
        const secretInfo = await docker.getSecret('gitpaas_postgres_password').inspect();
        console.log('✅ PostgreSQL secret already exists');
        return secretInfo.ID;
    } catch {
        const crypto = await import('node:crypto');
        const password = crypto.randomBytes(24).toString('base64url');

        process.env.DATABASE_URL = `postgres://gitpaas:${encodeURIComponent(password)}@gitpaas-postgres:5432/gitpaas`;
        console.log('✅ DATABASE_URL configured');

        const secret = await docker.createSecret({
            Name: 'gitpaas_postgres_password',
            Data: Buffer.from(password).toString('base64'),
        });
        console.log('✅ PostgreSQL secret created');
        return (secret as unknown as { id: string }).id;
    }
};

/**
 * Connect the current container to gitpaas-network so it can reach Postgres.
 */
const connectToNetwork = async (): Promise<void> => {
    const containerId = hostname();
    const network = docker.getNetwork('gitpaas-network');

    try {
        await network.connect({ Container: containerId });
    } catch (error: unknown) {
        const msg = (error as Error).message || '';
        if (!msg.includes('already exists')) {
            throw error;
        }
    }
};

/**
 * Wait for PostgreSQL to be ready
 */
export async function waitForPostgres(maxAttempts = 30): Promise<void> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            // Find the PostgreSQL container
            const containers = await docker.listContainers({
                filters: { label: ['com.docker.swarm.service.name=gitpaas-postgres'] },
            });

            if (containers.length === 0) {
                throw new Error('PostgreSQL container not found');
            }

            const container = docker.getContainer(containers[0].Id);

            // Execute pg_isready inside the container
            const exec = await container.exec({
                Cmd: ['pg_isready', '-h', 'localhost', '-p', '5432', '-U', 'postgres'],
                AttachStdout: true,
                AttachStderr: true,
            });

            const stream = await exec.start({ Detach: false, Tty: false });

            // Wait for the exec to finish and check exit code
            await new Promise<void>((resolve, reject) => {
                stream.on('end', async () => {
                    const inspectResult = await exec.inspect();
                    if (inspectResult.ExitCode === 0) {
                        resolve();
                    } else {
                        reject(new Error(`pg_isready exited with code ${inspectResult.ExitCode}`));
                    }
                });
                stream.on('error', reject);
                stream.resume();
            });

            return;
        } catch {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }

    throw new Error('PostgreSQL failed to become ready within the expected time');
}

/**
 * Connect the setup container to gitpaas-network so Prisma can reach Postgres.
 */
export const configureDatabaseUrl = async (): Promise<void> => {
    if (setupMode === 'local') {
        return;
    }

    await connectToNetwork();
};

/**
 * Initialize Postgres service in Docker Swarm
 */
export const initializePostgres = async () => {
    const isLocal = setupMode === 'local';
    const imageName = process.env.POSTGRES_IMAGE || 'postgres:18.3-alpine3.23';
    const containerName = 'gitpaas-postgres';

    let secretId: string | undefined;
    if (!isLocal) {
        secretId = await ensurePostgresSecret();
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
                            SecretID: secretId,
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

        if (images.length === 0) {
            await pullImage(imageName);
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
        } else {
            await docker.createService(settings);
        }
    } catch (error) {
        console.log('❌ Postgres service setup failed', error);
    }
};
