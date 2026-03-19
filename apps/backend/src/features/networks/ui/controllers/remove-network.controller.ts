import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { removeNetworkUseCase } from '../../application/use-cases/remove-network.use-case';
import { networkDockerGateway } from '../../infrastructure/docker/network-docker.gateway';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Remove network controller
 *
 * @param req Request
 * @param res Response
 */
export const removeNetworkController: RequestHandler<{ id: string }> = async (req, res) => {
    try {
        const { id } = req.params;

        const success = await removeNetworkUseCase(networkDockerGateway, id);

        if (!success) {
            res.status(StatusCodes.NOT_FOUND).send({ error: 'Network not found' });
            return;
        }

        res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Remove network controller');
        handleError(error as Error, res);
    }
};
