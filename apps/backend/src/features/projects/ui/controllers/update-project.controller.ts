import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { updateProjectOrchestrator } from '../../application/orchestrators/update-project.orchestrator';
import { projectPrismaRepository } from '../../infrastructure/database/project-prisma.repository';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Update project controller
 *
 * @param req Request
 * @param res Response
 */
export const updateProjectController: RequestHandler = async (req, res) => {
    try {
        const { projectId } = req.params;
        const updateDto = { id: projectId, ...req.body };

        const result = await updateProjectOrchestrator(projectPrismaRepository, updateDto);

        if (!result) {
            res.status(StatusCodes.NOT_FOUND).send({ message: 'Project not found' });
            return;
        }

        res.status(StatusCodes.OK).send(result);
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Update project controller');

        handleError(error as Error, res);
    }
};
