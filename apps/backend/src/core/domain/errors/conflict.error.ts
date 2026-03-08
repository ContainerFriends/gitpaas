/**
 * Conflict error
 *
 * Thrown when a resource conflict occurs (e.g., duplicate entry)
 */
export class ConflictError extends Error {
    constructor(message: string = 'Resource conflict') {
        super(message);
        this.name = 'ConflictError';

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ConflictError);
        }
    }
}
