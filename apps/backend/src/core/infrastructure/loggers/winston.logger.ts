import { styleText } from 'node:util';

import { format as formatDate } from 'date-fns';
import { LoggerOptions, format, createLogger, transports } from 'winston';
import LokiTransport from 'winston-loki';

import { AppLogger, LogEntry } from '../../domain/interfaces/logger.interface';

const { combine, printf, timestamp } = format;

// eslint-disable-next-line @typescript-eslint/no-shadow, object-curly-newline
const myFormat = printf(({ level, message, label, timestamp, ...meta }) => {
    const levelEmojis: Record<string, string> = {
        info: '🟢',
        warn: '🟡',
        error: '🔴',
        debug: '🟠',
    };

    // Usamos el mismo color para el level, timestamp y label
    const coloredLevel = styleText('green', level.toUpperCase());
    const formattedTimestamp = typeof timestamp === 'string' || typeof timestamp === 'number' ? formatDate(new Date(timestamp), 'yyyy-MM-dd HH:mm:ss') : 'Invalid timestamp';

    // Usamos el mismo color para el timestamp y el label
    const coloredTimestamp = styleText('green', formattedTimestamp);
    const coloredLabel = styleText('green', label as string);

    // Serialize message properly
    let formattedMessage: string;
    if (typeof message === 'string') {
        formattedMessage = message;
    } else if (typeof message === 'number' || typeof message === 'boolean') {
        formattedMessage = String(message);
    } else if (message === null) {
        formattedMessage = 'null';
    } else if (message === undefined) {
        formattedMessage = 'undefined';
    } else {
        formattedMessage = JSON.stringify(message);
    }

    // Add structured fields if present
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';

    return `${levelEmojis[level] || '🔔'} [${coloredLevel}][${coloredTimestamp}][${coloredLabel}]: ${formattedMessage}${metaStr}`;
});

/**
 * Create transports array with Console and optionally Loki
 */
function createTransports(): any[] {
    const transportsList: any[] = [new transports.Console()];

    // Add Loki transport if configured
    const ENABLE_LOKI_LOGS = process.env.ENABLE_LOKI_LOGS === 'true';
    const LOKI_URL = process.env.LOKI_URL;

    if (ENABLE_LOKI_LOGS && LOKI_URL) {
        try {
            const lokiTransport = new LokiTransport({
                host: LOKI_URL,
                /* basicAuth: `${LOKI_USERNAME}:${LOKI_PASSWORD}`, */
                labels: {
                    app: 'pull-reviewer-backend',
                    environment: process.env.ENVIRONMENT || 'development',
                    service: 'backend',
                },
                json: true,
                format: format.json(),
                replaceTimestamp: true,
                onConnectionError: (err: unknown) => {
                    console.error('🔴 Loki connection error:', (err as Error).message);
                },
            });

            transportsList.push(lokiTransport);
            console.log('🟢 Loki logging enabled');
        } catch (error) {
            console.error('🔴 Failed to initialize Loki transport:', (error as Error).message);
        }
    } else if (ENABLE_LOKI_LOGS) {
        console.warn('🟡 Loki logging requested but missing configuration (LOKI_URL, LOKI_USERNAME, LOKI_PASSWORD)');
    }

    return transportsList;
}

const loggerOptions: LoggerOptions = {
    level: process.env.LOG_LEVEL || 'debug',
    format: combine(timestamp(), myFormat),
    transports: createTransports(),
};

const winstonLogger = createLogger(loggerOptions);

export const appLogger: AppLogger = {
    info: (message: LogEntry, label: string) => {
        const { message: msg, ...meta } = message as any;
        winstonLogger.child({ label, ...meta }).info(msg || 'Structured log');
    },
    warn: (message: LogEntry, label: string) => {
        const { message: msg, ...meta } = message as any;
        winstonLogger.child({ label, ...meta }).warn(msg || 'Structured log');
    },
    error: (message: LogEntry, label: string) => {
        const { message: msg, ...meta } = message as any;
        winstonLogger.child({ label, ...meta }).error(msg || 'Structured log');
    },
    debug: (message: LogEntry, label: string) => {
        const { message: msg, ...meta } = message as any;
        winstonLogger.child({ label, ...meta }).debug(msg || 'Structured log');
    },
};
