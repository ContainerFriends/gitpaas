import { RequestHandler } from 'express';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';
import { installGithubAppOrchestrator } from '@features/git-providers/application/orchestrators/install-github-app.orchestrator';
import { gitProviderPrismaRepository } from '@features/git-providers/infrastructure/database/git-provider-prisma.repository';
import { gitProviderGithubOctokitGateway } from '@features/git-providers/infrastructure/octokit/git-provider-octokit.gateway';

/**
 * Install GitHub App controller
 *
 * @param req Request
 * @param res Response
 */
export const installGithubAppController: RequestHandler<unknown, unknown, unknown, { code: string; state: string; traceId: string }> = async (
    req,
    res,
) => {
    try {
        const { code, state, traceId } = req.query;

        const decodedState = JSON.parse(atob(state));

        const appConfig = await installGithubAppOrchestrator(
            gitProviderGithubOctokitGateway,
            gitProviderPrismaRepository,
            code,
            traceId,
            decodedState,
        );

        const installUrl = `https://github.com/apps/${appConfig.slug}/installations/new`;

        res.redirect(installUrl);
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Install app controller');

        handleError(error as Error, res);
    }
};
