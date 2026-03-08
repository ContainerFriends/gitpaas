/**
 * Authentication error
 *
 * Thrown when user authentication fails
 */
export class AuthenticationError extends Error {
    constructor(message: string = 'Unauthorized') {
        super(message);
        this.name = 'AuthenticationError';

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AuthenticationError);
        }
    }
}
