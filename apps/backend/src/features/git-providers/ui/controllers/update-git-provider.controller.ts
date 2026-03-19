import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { updateGitProviderOrchestrator } from '../../application/orchestrators/update-git-provider.orchestrator';
import { gitProviderPrismaRepository } from '../../infrastructure/database/git-provider-prisma.repository';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Update git provider controller
 *
 * @param req Request
 * @param res Response
 */
export const updateGitProviderController: RequestHandler<{ gitProviderId: string }> = async (req, res) => {
    try {
        const { gitProviderId } = req.params;
        const updateDto = { id: gitProviderId, ...req.body };

        const result = await updateGitProviderOrchestrator(gitProviderPrismaRepository, updateDto);

        if (!result) {
            res.status(StatusCodes.NOT_FOUND).send({ message: 'Git provider not found' });
            return;
        }

        res.status(StatusCodes.OK).send(result);
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Update git provider controller');

        handleError(error as Error, res);
    }
};
