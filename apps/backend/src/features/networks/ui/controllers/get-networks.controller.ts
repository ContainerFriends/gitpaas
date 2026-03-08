import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { getNetworksOrchestrator } from '../../application/orchestrators/get-networks.orchestrator';
import { networkDockerRepository } from '../../infrastructure/docker/network-docker.repository';
import { mapDomainToDto } from '../../infrastructure/docker/network-docker.mapper';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Get networks controller
 *
 * @param req Request
 * @param res Response
 */
export const getNetworksController: RequestHandler = async (_req, res) => {
    try {
        const networks = await getNetworksOrchestrator(networkDockerRepository);
        const responseData = {
            networks: networks.map(mapDomainToDto),
            total: networks.length,
        };

        res.status(StatusCodes.OK).send(responseData);
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Get networks controller');
        handleError(error as Error, res);
    }
};