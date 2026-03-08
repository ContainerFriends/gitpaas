import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { getNetworkByIdUseCase } from '../../application/use-cases/get-network-by-id.use-case';
import { networkDockerGateway } from '../../infrastructure/docker/network-docker.gateway';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Get network by ID controller
 *
 * @param req Request
 * @param res Response
 */
export const getNetworkByIdController: RequestHandler<{ id: string }> = async (req, res) => {
    try {
        const { id } = req.params;

        const network = await getNetworkByIdUseCase(networkDockerGateway, id);

        if (!network) {
            res.status(StatusCodes.NOT_FOUND).send({ error: 'Network not found' });
            return;
        }

        res.status(StatusCodes.OK).send(network);
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Get network by ID controller');
        handleError(error as Error, res);
    }
};
