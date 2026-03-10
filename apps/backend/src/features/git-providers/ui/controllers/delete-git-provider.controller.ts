import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { deleteGitProviderOrchestrator } from '../../application/orchestrators/delete-git-provider.orchestrator';
import { gitProviderPrismaRepository } from '../../infrastructure/database/git-provider-prisma.repository';
import { gitProviderGithubOctokitGateway } from '../../infrastructure/octokit/git-provider-octokit.gateway';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Delete git provider controller
 *
 * @param req Request
 * @param res Response
 */
export const deleteGitProviderController: RequestHandler<{ gitProviderId: string }> = async (req, res) => {
    try {
        const { gitProviderId } = req.params;
        const result = await deleteGitProviderOrchestrator(gitProviderPrismaRepository, gitProviderGithubOctokitGateway, gitProviderId);

        if (!result) {
            res.status(StatusCodes.NOT_FOUND).send({ message: 'Git provider not found' });
            return;
        }

        res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Delete git provider controller');

        handleError(error as Error, res);
    }
};
