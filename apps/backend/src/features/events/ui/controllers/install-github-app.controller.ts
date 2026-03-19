import { RequestHandler } from 'express';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';
import { installGithubAppOrchestrator } from '@features/installations/application/orchestrators/install-github-app.orchestrator';
import { installationsGithubOctokitGateway } from '@features/installations/infrastructure/octokit/installations-octokit.gateway';

/**
 * Install GitHub App controller
 *
 * @param req Request
 * @param res Response
 */
export const installGithubAppController: RequestHandler<unknown, unknown, unknown, { code: string }> = async (req, res) => {
    try {
        const { code } = req.query;

        const appConfig = await installGithubAppOrchestrator(installationsGithubOctokitGateway, code);

        const installUrl = `https://github.com/apps/${appConfig.slug}/installations/new`;

        res.redirect(installUrl);
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Install app controller');

        handleError(error as Error, res);
    }
};
