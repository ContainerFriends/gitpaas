import { RequestHandler } from 'express';

import { checkForGithubAppOrchestrator } from '../../application/orchestrators/check-for-github-app.orchestrator';
import { systemPrismaRepository } from '../../infrastructure/database/system-prisma.repository';

import { prismaClient } from '@core/infrastructure/prisma/prisma.client';

/**
 * Health controller
 *
 * @param req Request
 * @param res Response
 */
export const healthController: RequestHandler = async (_req, res) => {
    const dbHealthy = await prismaClient.healthCheck();
    const status = dbHealthy ? 'healthy' : 'unhealthy';

    const githubAppStatus = await checkForGithubAppOrchestrator(systemPrismaRepository);

    res.status(dbHealthy ? 200 : 503).json({
        status,
        timestamp: new Date().toISOString(),
        services: {
            database: dbHealthy ? 'up' : 'down',
            githubApp: githubAppStatus,
        },
    });
};
