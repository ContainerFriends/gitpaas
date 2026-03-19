import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { getBranchesOrchestrator } from '../../application/orchestrators/get-branches.orchestrator';
import { repositoryGithubOctokitGateway } from '../../infrastructure/octokit/repository-octokit.gateway';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';
import { gitProviderPrismaRepository } from '@features/git-providers/infrastructure/database/git-provider-prisma.repository';

/**
 * Get branches controller
 *
 * @param req Request
 * @param res Response
 */
export const getBranchesController: RequestHandler<unknown, unknown, unknown, { gitProviderId: string; repositoryId: string }> = async (req, res) => {
    try {
        const { gitProviderId, repositoryId } = req.query;

        const branches = await getBranchesOrchestrator(gitProviderPrismaRepository, repositoryGithubOctokitGateway, gitProviderId, repositoryId);

        res.status(StatusCodes.OK).json(branches);
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Get branches controller');
        handleError(error as Error, res);
    }
};
