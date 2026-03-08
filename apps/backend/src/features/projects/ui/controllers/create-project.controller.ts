import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { createProjectOrchestrator } from '../../application/orchestrators/create-project.orchestrator';
import { projectPrismaRepository } from '../../infrastructure/database/project-prisma.repository';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Create project controller
 *
 * @param req Request
 * @param res Response
 */
export const createProjectController: RequestHandler = async (req, res) => {
    try {
        const result = await createProjectOrchestrator(projectPrismaRepository, req.body);

        res.status(StatusCodes.CREATED).send(result);
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Create project controller');

        handleError(error as Error, res);
    }
};
