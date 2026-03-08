import type { ContainerCreateOptions } from 'dockerode';

import { paths } from '../configs/paths';
import { TRAEFIK_HTTP3_PORT, TRAEFIK_PORT, TRAEFIK_SSL_PORT, TRAEFIK_VERSION, TraefikOptions } from '../configs/traefik';
import { getRemoteDocker } from '../services/docker';

/**
 * Initialize Traefik service
 */
export const initializeStandaloneTraefik = async ({ env, serverId, additionalPorts = [] }: TraefikOptions = {}): Promise<void> => {
    const { MAIN_TRAEFIK_PATH, DYNAMIC_TRAEFIK_PATH } = paths(!!serverId);
    const imageName = `traefik:v${TRAEFIK_VERSION}`;
    const containerName = 'gitpaas-traefik';

    const exposedPorts: Record<string, object> = {
        [`${TRAEFIK_PORT}/tcp`]: {},
        [`${TRAEFIK_SSL_PORT}/tcp`]: {},
        [`${TRAEFIK_HTTP3_PORT}/udp`]: {},
    };

    const portBindings: Record<string, Array<{ HostPort: string }>> = {
        [`${TRAEFIK_PORT}/tcp`]: [{ HostPort: TRAEFIK_PORT.toString() }],
        [`${TRAEFIK_SSL_PORT}/tcp`]: [{ HostPort: TRAEFIK_SSL_PORT.toString() }],
        [`${TRAEFIK_HTTP3_PORT}/udp`]: [{ HostPort: TRAEFIK_HTTP3_PORT.toString() }],
    };

    const enableDashboard = additionalPorts.some((port) => port.targetPort === 8080);

    if (enableDashboard) {
        exposedPorts['8080/tcp'] = {};
        portBindings['8080/tcp'] = [{ HostPort: '8080' }];
    }

    for (const port of additionalPorts) {
        const portKey = `${port.targetPort}/${port.protocol ?? 'tcp'}`;
        exposedPorts[portKey] = {};
        portBindings[portKey] = [{ HostPort: port.publishedPort.toString() }];
    }

    const settings: ContainerCreateOptions = {
        name: containerName,
        Image: imageName,
        NetworkingConfig: {
            EndpointsConfig: {
                'gitpaas-network': {},
            },
        },
        ExposedPorts: exposedPorts,
        HostConfig: {
            RestartPolicy: {
                Name: 'always',
            },
            Binds: [
                `${MAIN_TRAEFIK_PATH}/traefik.yml:/etc/traefik/traefik.yml`,
                `${DYNAMIC_TRAEFIK_PATH}:/etc/gitpaas/traefik/dynamic`,
                '/var/run/docker.sock:/var/run/docker.sock',
            ],
            PortBindings: portBindings,
        },
        Env: env,
    };

    const docker = await getRemoteDocker(serverId);

    try {
        await docker.pull(imageName);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        console.log('✅ Traefik Image Pulled');
    } catch (error) {
        console.log('Traefik Image Not Found: Pulling ', error);
    }
    try {
        const container = docker.getContainer(containerName);
        await container.remove({ force: true });
        await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch {
        console.log('Traefik Container Not Found: Starting new one');
    }

    try {
        await docker.createContainer(settings);
        const newContainer = docker.getContainer(containerName);
        await newContainer.start();
        console.log('✅ Traefik Started');
    } catch (error) {
        console.log('Traefik Not Found: Starting ', error);
    }
};
