import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { getServicesByProjectIdUseCase } from '../../application/use-cases/get-services-by-project-id.use-case';
import { servicesPrismaRepository } from '../../infrastructure/database/services-prisma.repository';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Get services by project ID controller
 *
 * @param req Request
 * @param res Response
 */
export const getServicesByProjectController: RequestHandler<{ projectId: string }> = async (req, res) => {
    try {
        const { projectId } = req.params;
        const result = await getServicesByProjectIdUseCase(servicesPrismaRepository, projectId);

        res.status(StatusCodes.OK).send(result);
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Get services by project controller');

        handleError(error as Error, res);
    }
};
