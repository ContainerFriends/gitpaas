import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { deleteProjectOrchestrator } from '../../application/orchestrators/delete-project.orchestrator';
import { projectPrismaRepository } from '../../infrastructure/database/project-prisma.repository';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Delete project controller
 *
 * @param req Request
 * @param res Response
 */
export const deleteProjectController: RequestHandler = async (req, res) => {
    try {
        const { projectId } = req.params;
        const result = await deleteProjectOrchestrator(projectPrismaRepository, projectId);

        if (!result) {
            res.status(StatusCodes.NOT_FOUND).send({ message: 'Project not found' });
            return;
        }

        res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Delete project controller');

        handleError(error as Error, res);
    }
};
