import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { removeNetworkUseCase } from '../../application/use-cases/remove-network.use-case';
import { networkDockerRepository } from '../../infrastructure/docker/network-docker.repository';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Remove network controller
 *
 * @param req Request
 * @param res Response
 */
export const removeNetworkController: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;

        const success = await removeNetworkUseCase(networkDockerRepository, id);

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