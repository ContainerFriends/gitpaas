import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { getGitProviderByIdOrchestrator } from '../../application/orchestrators/get-git-provider-by-id.orchestrator';
import { gitProviderPrismaRepository } from '../../infrastructure/database/git-provider-prisma.repository';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Get git provider by ID controller
 *
 * @param req Request
 * @param res Response
 */
export const getGitProviderByIdController: RequestHandler<{ gitProviderId: string }> = async (req, res) => {
    try {
        const { gitProviderId } = req.params;
        const result = await getGitProviderByIdOrchestrator(gitProviderPrismaRepository, gitProviderId);

        if (!result) {
            res.status(StatusCodes.NOT_FOUND).send({ message: 'Git provider not found' });
            return;
        }

        res.status(StatusCodes.OK).send(result);
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Get git provider by ID controller');

        handleError(error as Error, res);
    }
};
