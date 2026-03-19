import Docker from 'dockerode';

interface RegistryAuth {
    username: string;
    password: string;
    registryUrl: string;
}

const DOCKER_API_VERSION = process.env.DOCKER_API_VERSION;
const DOCKER_HOST = process.env.DOCKER_HOST;
const DOCKER_PORT = process.env.DOCKER_PORT ? Number(process.env.DOCKER_PORT) : undefined;

export const docker = new Docker({
    ...(DOCKER_API_VERSION && {
        version: DOCKER_API_VERSION,
    }),
    ...(DOCKER_HOST && {
        host: DOCKER_HOST,
    }),
    ...(DOCKER_PORT && {
        port: DOCKER_PORT,
    }),
});

/**
 * Pull a Docker image
 */
export const pullImage = async (dockerImage: string, onData?: (data: string) => void, authConfig?: Partial<RegistryAuth>): Promise<void> => {
    if (!dockerImage) {
        throw new Error('❌ Docker image not provided');
    }

    const options: Record<string, unknown> = {};

    if (authConfig?.username && authConfig?.password) {
        options.authconfig = {
            username: authConfig.username,
            password: authConfig.password,
            serveraddress: authConfig.registryUrl || '',
        };
    }

    const stream = await docker.pull(dockerImage, options);

    await new Promise<void>((resolve, reject) => {
        docker.modem.followProgress(
            stream,
            (error: Error | null) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            },
            (event: { status?: string }) => {
                if (onData) {
                    onData(JSON.stringify(event));
                }
            },
        );
    });
};
