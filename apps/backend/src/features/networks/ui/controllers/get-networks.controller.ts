import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { getNetworksOrchestrator } from '../../application/orchestrators/get-networks.orchestrator';
import { networkDockerGateway } from '../../infrastructure/docker/network-docker.gateway';

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
        const networks = await getNetworksOrchestrator(networkDockerGateway);

        res.status(StatusCodes.OK).send(networks);
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Get networks controller');
        handleError(error as Error, res);
    }
};
