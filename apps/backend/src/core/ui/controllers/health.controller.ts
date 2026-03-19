import { RequestHandler } from 'express';

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

    res.status(dbHealthy ? 200 : 503).json({
        status,
        timestamp: new Date().toISOString(),
        services: {
            database: dbHealthy ? 'up' : 'down',
        },
    });
};
