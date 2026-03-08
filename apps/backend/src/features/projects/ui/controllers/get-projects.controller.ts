import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { getProjectsOrchestrator } from '../../application/orchestrators/get-projects.orchestrator';
import { projectPrismaRepository } from '../../infrastructure/database/project-prisma.repository';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Get projects controller
 *
 * @param req Request
 * @param res Response
 */
export const getProjectsController: RequestHandler = async (_req, res) => {
    try {
        const result = await getProjectsOrchestrator(projectPrismaRepository);

        res.status(StatusCodes.OK).send(result);
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Get projects controller');

        handleError(error as Error, res);
    }
};
