import { VolumeGateway } from '../../domain/gateways/volume.gateway';
import { Volume } from '../../domain/models/volume.models';

import { volumeDockerMapper } from './volume-docker.mapper';

import { DockerError, DockerErrorType } from '@core/domain/errors/docker.error';
import { dockerClient } from '@core/infrastructure/docker/docker.client';

/**
 * Volume Docker gateway
 */
export const volumeDockerGateway: VolumeGateway = {
    getAllVolumes: async (): Promise<Volume[]> => {
        try {
            const response = await dockerClient.listVolumes();
            const volumes = response.Volumes || [];

            return volumes.map(volumeDockerMapper.toDomain);
        } catch (error) {
            throw new DockerError(`Failed to get volumes: ${(error as Error).message}`, DockerErrorType.API_ERROR);
        }
    },
    removeVolume: async (name: string): Promise<boolean> => {
        try {
            const volume = dockerClient.getVolume(name);
            await volume.remove();

            return true;
        } catch (error: any) {
            if (error.statusCode === 404) {
                return false;
            }
            throw new DockerError(`Failed to remove volume ${name}: ${error.message}`, DockerErrorType.API_ERROR);
        }
    },
};
