import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { createNetworkOrchestrator } from '../../application/orchestrators/create-network.orchestrator';
import { networkDockerGateway } from '../../infrastructure/docker/network-docker.gateway';

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
        const network = await createNetworkOrchestrator(networkDockerGateway, req.body);

        res.status(StatusCodes.CREATED).send(network);
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Create network controller');
        handleError(error as Error, res);
    }
};
