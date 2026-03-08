/**
 * Docker error types
 */
export enum DockerErrorType {
    API_ERROR = 'API_ERROR',
    NETWORK_NOT_FOUND = 'NETWORK_NOT_FOUND',
    CONTAINER_CONNECTION_ERROR = 'CONTAINER_CONNECTION_ERROR',
}

/**
 * Docker error
 *
 * Thrown when Docker operations fail
 */
export class DockerError extends Error {
    public readonly type: DockerErrorType;

    public readonly code?: string;

    constructor(message: string, type: DockerErrorType, code?: string) {
        super(message);
        this.name = 'DockerError';
        this.type = type;
        this.code = code;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DockerError);
        }
    }
}
