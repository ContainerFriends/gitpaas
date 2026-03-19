import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { getGitProvidersOrchestrator } from '../../application/orchestrators/get-git-providers.orchestrator';
import { gitProviderPrismaRepository } from '../../infrastructure/database/git-provider-prisma.repository';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Get git providers controller
 *
 * @param req Request
 * @param res Response
 */
export const getGitProvidersController: RequestHandler = async (_req, res) => {
    try {
        const result = await getGitProvidersOrchestrator(gitProviderPrismaRepository);

        res.status(StatusCodes.OK).send(result);
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Get git providers controller');

        handleError(error as Error, res);
    }
};
