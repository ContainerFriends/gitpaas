/**
 * Authorization error
 *
 * Thrown when user lacks permissions for a resource
 */
export class AuthorizationError extends Error {
    constructor(message: string = 'Forbidden') {
        super(message);
        this.name = 'AuthorizationError';

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AuthorizationError);
        }
    }
}
