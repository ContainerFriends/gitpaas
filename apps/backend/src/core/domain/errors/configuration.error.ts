/**
 * Configuration error
 *
 * Thrown when there are configuration issues (missing env vars, uninitialized clients, etc.)
 */
export class ConfigurationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ConfigurationError';

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ConfigurationError);
        }
    }
}
