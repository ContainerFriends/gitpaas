import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { updateServiceUseCase } from '../../application/use-cases/update-service.use-case';
import { servicesPrismaRepository } from '../../infrastructure/database/services-prisma.repository';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Update service controller
 *
 * @param req Request
 * @param res Response
 */
export const updateServiceController: RequestHandler<{ id: string }> = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await updateServiceUseCase(servicesPrismaRepository, id, req.body);

        res.status(StatusCodes.OK).send(result);
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Update service controller');

        handleError(error as Error, res);
    }
};
