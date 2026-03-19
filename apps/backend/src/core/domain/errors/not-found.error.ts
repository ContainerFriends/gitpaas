/**
 * Not found error
 *
 * Thrown when a requested resource does not exist
 */
export class NotFoundError extends Error {
    constructor(message: string = 'Resource not found') {
        super(message);
        this.name = 'NotFoundError';

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NotFoundError);
        }
    }
}
