/* eslint-disable camelcase */
import { RequestHandler } from 'express';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';
import { finishInstallGithubAppOrchestrator } from '@features/installations/application/orchestrators/finish-install-github-app.orchestrator';
import { systemPrismaRepository } from '@features/system/infrastructure/database/system-prisma.repository';

/**
 * Post install GitHub App controller
 *
 * @param req Request
 * @param res Response
 */
export const postInstallGithubAppController: RequestHandler<
    unknown,
    unknown,
    unknown,
    { setup_action: string; trace_id: string; installation_id: string }
> = async (req, res) => {
    try {
        const { setup_action, trace_id, installation_id } = req.query;

        if (setup_action === 'install') {
            await finishInstallGithubAppOrchestrator(systemPrismaRepository, trace_id, installation_id);
        }

        res.redirect(`${process.env.GITHUB_INSTALLER_URL}/installation-success`);
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Post install GitHub App controller');

        handleError(error as Error, res);
    }
};
