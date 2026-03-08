import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { getServiceByIdUseCase } from '../../application/use-cases/get-service-by-id.use-case';
import { servicesPrismaRepository } from '../../infrastructure/database/services-prisma.repository';

import { NotFoundError } from '@core/domain/errors/not-found.error';
import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Get service by ID controller
 *
 * @param req Request
 * @param res Response
 */
export const getServiceByIdController: RequestHandler<{ id: string }> = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await getServiceByIdUseCase(servicesPrismaRepository, id);

        if (!result) {
            throw new NotFoundError(`Service with ID ${id} not found`);
        }

        res.status(StatusCodes.OK).send(result);
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Get service by ID controller');

        handleError(error as Error, res);
    }
};
