import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { getProjectByIdOrchestrator } from '../../application/orchestrators/get-project-by-id.orchestrator';
import { projectPrismaRepository } from '../../infrastructure/database/project-prisma.repository';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Get project by ID controller
 *
 * @param req Request
 * @param res Response
 */
export const getProjectByIdController: RequestHandler = async (req, res) => {
    try {
        const { projectId } = req.params;
        const result = await getProjectByIdOrchestrator(projectPrismaRepository, projectId);

        if (!result) {
            res.status(StatusCodes.NOT_FOUND).send({ message: 'Project not found' });
            return;
        }

        res.status(StatusCodes.OK).send(result);
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Get project by ID controller');

        handleError(error as Error, res);
    }
};
