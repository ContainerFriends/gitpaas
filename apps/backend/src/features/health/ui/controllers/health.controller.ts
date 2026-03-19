import { RequestHandler } from 'express';

import { checkForGithubAppOrchestrator } from '../../application/orchestrators/check-for-github-app.orchestrator';

import { expressConfig } from '@core/infrastructure/express/config.express';
import { prismaClient } from '@core/infrastructure/prisma/prisma.client';
import { systemPrismaRepository } from '@features/system/infrastructure/database/system-prisma.repository';

/**
 * Health controller
 *
 * @param req Request
 * @param res Response
 */
export const healthController: RequestHandler<unknown, unknown, unknown, { token: string }> = async (req, res) => {
    const clientToken = req.query.token;
    const dbHealthy = await prismaClient.healthCheck();
    const status = dbHealthy ? 'healthy' : 'unhealthy';

    const githubAppStatus = await checkForGithubAppOrchestrator(systemPrismaRepository, clientToken, expressConfig.apiVersion);

    res.status(dbHealthy ? 200 : 503).json({
        status,
        timestamp: new Date().toISOString(),
        services: {
            database: dbHealthy ? 'up' : 'down',
            githubApp: githubAppStatus,
        },
    });
};
