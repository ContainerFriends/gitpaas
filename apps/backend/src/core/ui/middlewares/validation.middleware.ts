import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ObjectSchema } from 'joi';

import { appLogger } from '@core/infrastructure/loggers/winston.logger';

/**
 * Generic validation middleware factory
 *
 * @param schema Joi validation schema
 * @param property Property to validate (body, query, params)
 */
export const validateInput = (schema: ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req[property], {
            abortEarly: false,
            allowUnknown: false,
            stripUnknown: true,
        });

        if (error) {
            const errorMessage = error.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message.replace(/"/g, ''),
            }));

            appLogger.warn(
                {
                    message: `Validation error in ${property}`,
                    errors: errorMessage,
                    path: req.path,
                    method: req.method,
                },
                'Input validation middleware',
            );

            res.status(StatusCodes.BAD_REQUEST).json({
                error: 'Validation failed',
                details: errorMessage,
            });
            return;
        }

        next();
    };
};
