import { ContainerGateway } from '../../domain/gateways/container.gateway';
import { Container } from '../../domain/models/container.models';

import { containerDockerMapper } from './container-docker.mapper';

import { DockerError, DockerErrorType } from '@core/domain/errors/docker.error';
import { dockerClient } from '@core/infrastructure/docker/docker.client';

/**
 * Container Docker gateway
 */
export const containerDockerGateway: ContainerGateway = {
    getAllContainers: async (): Promise<Container[]> => {
        try {
            const containers = await dockerClient.listContainers({ all: true });

            return containers.map(containerDockerMapper.toDomain);
        } catch (error) {
            throw new DockerError(`Failed to get containers: ${(error as Error).message}`, DockerErrorType.API_ERROR);
        }
    },
};
