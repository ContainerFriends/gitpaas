import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { deleteServiceUseCase } from '../../application/use-cases/delete-service.use-case';
import { servicesPrismaRepository } from '../../infrastructure/database/services-prisma.repository';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Delete service controller
 *
 * @param req Request
 * @param res Response
 */
export const deleteServiceController: RequestHandler<{ id: string }> = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteServiceUseCase(servicesPrismaRepository, id);

        res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Delete service controller');

        handleError(error as Error, res);
    }
};
