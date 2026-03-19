import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { getRepositoriesOrchestrator } from '../../application/orchestrators/get-repositories.orchestrator';
import { repositoryGithubOctokitGateway } from '../../infrastructure/octokit/repository-octokit.gateway';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';
import { gitProviderPrismaRepository } from '@features/git-providers/infrastructure/database/git-provider-prisma.repository';

/**
 * Get repositories controller
 *
 * @param req Request
 * @param res Response
 */
export const getRepositoriesController: RequestHandler<unknown, unknown, unknown, { gitProviderId: string }> = async (req, res) => {
    try {
        const { gitProviderId } = req.query;

        const repositories = await getRepositoriesOrchestrator(gitProviderPrismaRepository, repositoryGithubOctokitGateway, gitProviderId);

        res.status(StatusCodes.OK).json(repositories);
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Get repositories controller');
        handleError(error as Error, res);
    }
};
