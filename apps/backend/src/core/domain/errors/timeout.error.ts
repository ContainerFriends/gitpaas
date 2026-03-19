/**
 * Timeout error
 *
 * Thrown when a request exceeds the allowed processing time
 */
export class TimeoutError extends Error {
    public readonly isRequestTimeout: boolean;

    constructor(message: string, isRequestTimeout = true) {
        super(message);
        this.name = 'TimeoutError';

        this.isRequestTimeout = isRequestTimeout;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TimeoutError);
        }
    }
}
