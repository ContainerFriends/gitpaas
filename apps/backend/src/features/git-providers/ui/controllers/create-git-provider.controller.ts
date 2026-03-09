import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { createGitProviderOrchestrator } from '../../application/orchestrators/create-git-provider.orchestrator';
import { gitProviderPrismaRepository } from '../../infrastructure/database/git-provider-prisma.repository';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Create git provider controller
 *
 * @param req Request
 * @param res Response
 */
export const createGitProviderController: RequestHandler = async (req, res) => {
    try {
        const result = await createGitProviderOrchestrator(gitProviderPrismaRepository, req.body);

        res.status(StatusCodes.CREATED).send(result);
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Create git provider controller');

        handleError(error as Error, res);
    }
};
