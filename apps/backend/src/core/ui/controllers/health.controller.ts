import { RequestHandler } from 'express';

/**
 * Health controller
 *
 * @param req Request
 * @param res Response
 */
export const healthController: RequestHandler = (_req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
    });
};
