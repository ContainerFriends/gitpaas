import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { getContainersOrchestrator } from '../../application/orchestrators/get-containers.orchestrator';
import { containerDockerGateway } from '../../infrastructure/docker/container-docker.gateway';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Get containers controller
 *
 * @param req Request
 * @param res Response
 */
export const getContainersController: RequestHandler = async (_req, res) => {
    try {
        const containers = await getContainersOrchestrator(containerDockerGateway);

        res.status(StatusCodes.OK).send(containers);
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Get containers controller');
        handleError(error as Error, res);
    }
};
