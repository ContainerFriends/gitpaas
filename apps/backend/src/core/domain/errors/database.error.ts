/**
 * Database error types
 */
export enum DatabaseErrorType {
    DATA_NOT_FOUND = 'DATA_NOT_FOUND',
    MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
    DATABASE_WRITE_ERROR = 'DATABASE_WRITE_ERROR',
    DATABASE_CONNECTION_ERROR = 'DATABASE_CONNECTION_ERROR',
    DUPLICATE_KEY_ERROR = 'DUPLICATE_KEY_ERROR',
}

/**
 * Custom database error class
 */
export class DatabaseError extends Error {
    public readonly type: DatabaseErrorType;

    public readonly code?: string;

    constructor(message: string, type: DatabaseErrorType, code?: string) {
        super(message);
        this.name = 'DatabaseError';
        this.type = type;
        this.code = code;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DatabaseError);
        }
    }
}
