

/* import { getRemoteDocker } from './remote-docker';
import type { MainTraefikConfig, FileConfig } from './traefik-config'; */







/* export const initializeTraefikService = async ({ env, additionalPorts = [], serverId }: TraefikOptions) => {
    const { MAIN_TRAEFIK_PATH, DYNAMIC_TRAEFIK_PATH } = paths(!!serverId);
    const imageName = `traefik:v${TRAEFIK_VERSION}`;
    const appName = 'dokploy-traefik';

    const settings: CreateServiceOptions = {
        Name: appName,
        TaskTemplate: {
            ContainerSpec: {
                Image: imageName,
                Env: env,
                Mounts: [
                    {
                        Type: 'bind',
                        Source: `${MAIN_TRAEFIK_PATH}/traefik.yml`,
                        Target: '/etc/traefik/traefik.yml',
                    },
                    {
                        Type: 'bind',
                        Source: DYNAMIC_TRAEFIK_PATH,
                        Target: '/etc/dokploy/traefik/dynamic',
                    },
                    {
                        Type: 'bind',
                        Source: '/var/run/docker.sock',
                        Target: '/var/run/docker.sock',
                    },
                ],
            },
            Networks: [{ Target: 'dokploy-network' }],
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
                    TargetPort: 443,
                    PublishedPort: TRAEFIK_SSL_PORT,
                    PublishMode: 'host',
                    Protocol: 'tcp',
                },
                {
                    TargetPort: 443,
                    PublishedPort: TRAEFIK_SSL_PORT,
                    PublishMode: 'host',
                    Protocol: 'udp',
                },
                {
                    TargetPort: 80,
                    PublishedPort: TRAEFIK_PORT,
                    PublishMode: 'host',
                    Protocol: 'tcp',
                },

                ...additionalPorts.map((port) => ({
                    TargetPort: port.targetPort,
                    PublishedPort: port.publishedPort,
                    Protocol: port.protocol as 'tcp' | 'udp' | 'sctp' | undefined,
                    PublishMode: 'host' as const,
                })),
            ],
        },
    };
    const docker = await getRemoteDocker(serverId);
    try {
        const service = docker.getService(appName);
        const inspect = await service.inspect();

        await service.update({
            version: Number.parseInt(inspect.Version.Index),
            ...settings,
            TaskTemplate: {
                ...settings.TaskTemplate,
                ForceUpdate: inspect.Spec.TaskTemplate.ForceUpdate + 1,
            },
        });
        console.log('Traefik Updated ✅');
    } catch {
        await docker.createService(settings);
        console.log('Traefik Started ✅');
    }
}; */





/* export const getDefaultServerTraefikConfig = () => {
    const configObject: MainTraefikConfig = {
        providers: {
            swarm: {
                exposedByDefault: false,
                watch: true,
            },
            docker: {
                exposedByDefault: false,
                watch: true,
                network: 'dokploy-network',
            },
            file: {
                directory: '/etc/dokploy/traefik/dynamic',
                watch: true,
            },
        },
        entryPoints: {
            web: {
                address: `:${TRAEFIK_PORT}`,
            },
            websecure: {
                address: `:${TRAEFIK_SSL_PORT}`,
                http3: {
                    advertisedPort: TRAEFIK_HTTP3_PORT,
                },
                http: {
                    tls: {
                        certResolver: 'letsencrypt',
                    },
                },
            },
        },
        api: {
            insecure: true,
        },
        certificatesResolvers: {
            letsencrypt: {
                acme: {
                    email: 'test@localhost.com',
                    storage: '/etc/dokploy/traefik/dynamic/acme.json',
                    httpChallenge: {
                        entryPoint: 'web',
                    },
                },
            },
        },
    };

    const yamlStr = stringify(configObject);

    return yamlStr;
}; */

