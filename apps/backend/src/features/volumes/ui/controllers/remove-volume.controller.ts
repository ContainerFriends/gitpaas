import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { removeVolumeOrchestrator } from '../../application/orchestrators/remove-volume.orchestrator';
import { volumeDockerGateway } from '../../infrastructure/docker/volume-docker.gateway';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Remove volume controller
 *
 * @param req Request
 * @param res Response
 */
export const removeVolumeController: RequestHandler<{ name: string }> = async (req, res) => {
    try {
        const { name } = req.params;

        const success = await removeVolumeOrchestrator(volumeDockerGateway, name);

        if (!success) {
            res.status(StatusCodes.NOT_FOUND).send({ error: 'Volume not found' });
            return;
        }

        res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Remove volume controller');
        handleError(error as Error, res);
    }
};
