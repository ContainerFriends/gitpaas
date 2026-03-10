/* eslint-disable camelcase */
import { RequestHandler } from 'express';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';
import { finishInstallGithubAppOrchestrator } from '@features/git-providers/application/orchestrators/finish-install-github-app.orchestrator';
import { gitProviderPrismaRepository } from '@features/git-providers/infrastructure/database/git-provider-prisma.repository';

/**
 * Post install GitHub App controller
 *
 * @param req Request
 * @param res Response
 */
export const postInstallGithubAppController: RequestHandler<unknown, unknown, unknown, { traceId: string; setup_action: string }> = async (
    req,
    res,
) => {
    try {
        const { traceId, setup_action } = req.query;

        if (setup_action === 'install') {
            await finishInstallGithubAppOrchestrator(gitProviderPrismaRepository, traceId);
        }

        res.redirect(`${process.env.FRONTEND_URL}/git-providers`);
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Post install GitHub App controller');

        handleError(error as Error, res);
    }
};
