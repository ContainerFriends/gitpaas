import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { createNetworkOrchestrator } from '../../application/orchestrators/create-network.orchestrator';
import { networkDockerRepository } from '../../infrastructure/docker/network-docker.repository';
import { mapDomainToDto } from '../../infrastructure/docker/network-docker.mapper';
import { CreateNetworkRequestDto } from '../../domain/dtos/network.dtos';
import { DockerNetworkCreateOptions } from '../../domain/models/network.models';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Create network controller
 *
 * @param req Request
 * @param res Response
 */
export const createNetworkController: RequestHandler = async (req, res) => {
    try {
        const requestData: CreateNetworkRequestDto = req.body;

        const createOptions: DockerNetworkCreateOptions = {
            name: requestData.name,
            driver: requestData.driver,
            internal: requestData.internal,
            attachable: requestData.attachable,
            ingress: requestData.ingress,
            options: requestData.options,
            labels: requestData.labels,
        };

        // Add IPAM configuration if subnet/gateway provided
        if (requestData.subnet || requestData.gateway) {
            createOptions.ipam = {
                config: [{
                    subnet: requestData.subnet,
                    gateway: requestData.gateway,
                }],
            };
        }

        const network = await createNetworkOrchestrator(networkDockerRepository, createOptions);

        res.status(StatusCodes.CREATED).send(mapDomainToDto(network));
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Create network controller');
        handleError(error as Error, res);
    }
};