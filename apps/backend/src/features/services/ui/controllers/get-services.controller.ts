import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { getServicesOrchestrator } from '../../application/orchestrators/get-services.orchestrator';
import { servicesPrismaRepository } from '../../infrastructure/database/services-prisma.repository';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Get all services controller
 *
 * @param req Request
 * @param res Response
 */
export const getServicesController: RequestHandler = async (_req, res) => {
    try {
        const result = await getServicesOrchestrator(servicesPrismaRepository);

        res.status(StatusCodes.OK).send(result);
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Get services controller');

        handleError(error as Error, res);
    }
};
