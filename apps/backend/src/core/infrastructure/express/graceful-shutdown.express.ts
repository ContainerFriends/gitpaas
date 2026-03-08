import { Server } from 'http';

import { appLogger } from '../loggers/winston.logger';
import { prismaClient } from '../prisma/prisma.client';

/**
 * Graceful shutdown configuration
 */
const SHUTDOWN_TIMEOUT = 10000; // 10 seconds

/**
 * Setup graceful shutdown handlers for the HTTP server
 *
 * @param server HTTP server instance
 */
export function setupGracefulShutdown(server: Server): void {
    /**
     * Graceful shutdown handler
     */
    const gracefulShutdown = (signal: string) => {
        appLogger.info({ message: `${signal} received, starting graceful shutdown...` }, 'Application');

        // Stop accepting new connections
        server.close(async (error) => {
            if (error) {
                appLogger.error({ message: 'Error during server shutdown', error: error.message }, 'Application');
            } else {
                appLogger.info({ message: 'HTTP server closed' }, 'Application');
            }

            try {
                // Close database connections
                await prismaClient.disconnect();
                appLogger.info({ message: 'Database connections closed' }, 'Application');

                appLogger.info({ message: 'Graceful shutdown completed' }, 'Application');
                process.exit(0);
            } catch (shutdownError) {
                appLogger.error(
                    {
                        message: 'Error during graceful shutdown',
                        error: shutdownError instanceof Error ? shutdownError.message : String(shutdownError),
                    },
                    'Application',
                );
                process.exit(1);
            }
        });

        // Force shutdown after timeout
        setTimeout(() => {
            appLogger.error({ message: 'Graceful shutdown timeout, forcing exit' }, 'Application');
            process.exit(1);
        }, SHUTDOWN_TIMEOUT);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => {
        gracefulShutdown('SIGTERM');
    });

    process.on('SIGINT', () => {
        gracefulShutdown('SIGINT');
    });
}
