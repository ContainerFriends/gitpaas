import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';

import { AuthenticationError } from '../../domain/errors/authentication.error';
import { AuthorizationError } from '../../domain/errors/authorization.error';
import { BadRequestError } from '../../domain/errors/bad-request.error';
import { ConfigurationError } from '../../domain/errors/configuration.error';
import { ConflictError } from '../../domain/errors/conflict.error';
import { DatabaseError, DatabaseErrorType } from '../../domain/errors/database.error';
import { NotFoundError } from '../../domain/errors/not-found.error';
import { TimeoutError } from '../../domain/errors/timeout.error';

// eslint-disable-next-line import/no-named-as-default-member
const { ValidationError } = Joi;

/**
 * Centralized error handler to map error types to HTTP responses
 */
export const handleError = (error: Error, res: Response) => {
    // Authentication errors
    if (error instanceof AuthenticationError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            error: 'Unauthorized',
            message: error.message,
        });
    }

    // Authorization errors
    if (error instanceof AuthorizationError) {
        return res.status(StatusCodes.FORBIDDEN).json({
            error: 'Forbidden',
            message: error.message,
        });
    }

    // Not found errors
    if (error instanceof NotFoundError) {
        return res.status(StatusCodes.NOT_FOUND).json({
            error: 'Not Found',
            message: error.message,
        });
    }

    // Bad request errors
    if (error instanceof BadRequestError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'Bad Request',
            message: error.message,
        });
    }

    // Conflict errors
    if (error instanceof ConflictError) {
        return res.status(StatusCodes.CONFLICT).json({
            error: 'Conflict',
            message: error.message,
        });
    }

    // Configuration errors
    if (error instanceof ConfigurationError) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Configuration Error',
            message: error.message,
        });
    }

    // Timeout errors
    if (error instanceof TimeoutError) {
        const statusCode = error.isRequestTimeout ? StatusCodes.REQUEST_TIMEOUT : StatusCodes.GATEWAY_TIMEOUT;
        const errorType = error.isRequestTimeout ? 'Request Timeout' : 'Gateway Timeout';
        return res.status(statusCode).json({
            error: errorType,
            message: error.message,
        });
    }

    // Database errors
    if (error instanceof DatabaseError) {
        switch (error.type) {
            case DatabaseErrorType.DATA_NOT_FOUND:
                return res.status(StatusCodes.NOT_FOUND).json({
                    error: 'Not Found',
                    message: error.message,
                    code: error.code,
                });

            case DatabaseErrorType.MISSING_REQUIRED_FIELD:
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: 'Bad Request',
                    message: error.message,
                    code: error.code,
                });

            case DatabaseErrorType.DATABASE_WRITE_ERROR:
                return res.status(StatusCodes.CONFLICT).json({
                    error: 'Conflict',
                    message: error.message,
                    code: error.code,
                });

            case DatabaseErrorType.DUPLICATE_KEY_ERROR:
                return res.status(StatusCodes.CONFLICT).json({
                    error: 'Conflict',
                    message: error.message,
                    code: error.code,
                });

            case DatabaseErrorType.DATABASE_CONNECTION_ERROR:
            default:
                return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
                    error: 'Service Unavailable',
                    message: 'Database connection error',
                    code: error.code,
                });
        }
    }

    // Joi validation errors
    if (error instanceof ValidationError) {
        const details = error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message.replace(/"/g, ''),
        }));

        return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'Validation Error',
            message: 'Request validation failed',
            details,
        });
    }

    // Default: Internal Server Error
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
    });
};

/**
 * Helper function to safely extract error message from unknown error types
 *
 * This utility provides a consistent way to handle error extraction across the application.
 *
 * @param error - The error of unknown type to extract message from
 *
 * @returns A string representation of the error
 */
export function getErrorMessage(error: unknown): string {
    if (error instanceof DatabaseError) {
        return `DatabaseError(${error.type}): ${error.message}`;
    }

    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    // For objects or other types, try to serialize safely
    try {
        return JSON.stringify(error);
    } catch {
        return 'Unknown error occurred';
    }
}
