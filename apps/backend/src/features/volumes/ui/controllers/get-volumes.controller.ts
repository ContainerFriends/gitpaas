import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { getVolumesOrchestrator } from '../../application/orchestrators/get-volumes.orchestrator';
import { volumeDockerGateway } from '../../infrastructure/docker/volume-docker.gateway';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Get volumes controller
 *
 * @param req Request
 * @param res Response
 */
export const getVolumesController: RequestHandler = async (_req, res) => {
    try {
        const volumes = await getVolumesOrchestrator(volumeDockerGateway);

        res.status(StatusCodes.OK).send(volumes);
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Get volumes controller');
        handleError(error as Error, res);
    }
};
