/**
 * Structured log entry for application logging
 */
export interface LogEntry {
    message: string;
    event?: string;
    installation?: string;
    repository?: string;
    pullRequest?: number;
    action?: string;
    error?: string;
    [key: string]: any;
}

/**
 * Application logger
 */
export interface AppLogger {
    info: (message: LogEntry, label: string) => void;
    warn: (message: LogEntry, label: string) => void;
    error: (message: LogEntry, label: string) => void;
    debug: (message: LogEntry, label: string) => void;
}
