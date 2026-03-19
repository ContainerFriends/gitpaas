/**
 * Github error types
 */
export enum GitHubErrorType {
    API_ERROR = 'API_ERROR',
}

/**
 * GitHub error
 *
 * Thrown when GitHub operations fail
 */
export class GitHubError extends Error {
    public readonly type: GitHubErrorType;

    public readonly code?: string;

    constructor(message: string, type: GitHubErrorType, code?: string) {
        super(message);
        this.name = 'GitHubError';
        this.type = type;
        this.code = code;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, GitHubError);
        }
    }
}
