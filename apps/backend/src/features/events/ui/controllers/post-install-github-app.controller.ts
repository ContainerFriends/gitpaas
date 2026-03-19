import { RequestHandler } from 'express';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';
import { handleError } from '@core/ui/handlers/error.handler';

/**
 * Post install GitHub App controller
 *
 * @param req Request
 * @param res Response
 */
export const postInstallGithubAppController: RequestHandler<unknown, unknown, unknown, { setup_action: string; installation_id: string }> = (
    req,
    res,
) => {
    try {
        res.redirect(`${process.env.GITHUB_INSTALLER_URL}/installation-success`);
    } catch (error) {
        appLogger.error({ message: `Error: ${(error as Error).message}` }, 'Post install GitHub App controller');

        handleError(error as Error, res);
    }
};
