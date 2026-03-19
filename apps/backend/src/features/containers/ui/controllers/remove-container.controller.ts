import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { removeContainerOrchestrator } from '../../application/orchestrators/remove-container.orchestrator';
import { containerDockerGateway } from '../../infrastructure/docker/container-docker.gateway';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Remove container controller
 *
 * @param req Request
 * @param res Response
 */
export const removeContainerController: RequestHandler<{ id: string }> = async (req, res) => {
    try {
        const { id } = req.params;

        const success = await removeContainerOrchestrator(containerDockerGateway, id);

        if (!success) {
            res.status(StatusCodes.NOT_FOUND).send({ error: 'Container not found' });
            return;
        }

        res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Remove container controller');
        handleError(error as Error, res);
    }
};
