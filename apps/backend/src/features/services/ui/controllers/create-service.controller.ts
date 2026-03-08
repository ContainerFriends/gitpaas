import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { createServiceOrchestrator } from '../../application/orchestrators/create-service.orchestrator';
import { servicesPrismaRepository } from '../../infrastructure/database/services-prisma.repository';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Create service controller
 *
 * @param req Request
 * @param res Response
 */
export const createServiceController: RequestHandler = async (req, res) => {
    try {
        const result = await createServiceOrchestrator(servicesPrismaRepository, req.body);

        res.status(StatusCodes.CREATED).send(result);
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Create service controller');

        handleError(error as Error, res);
    }
};
