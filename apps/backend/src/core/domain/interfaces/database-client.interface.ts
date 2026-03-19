/**
 * Database client interface

*/
export interface DatabaseClient {
    /**
     * Get the database client instance
     */
    getInstance: () => unknown;

    /**
     * Connect to the database
     */
    connect: () => Promise<void>;

    /**
     * Disconnect from the database
     */
    disconnect: () => Promise<void>;

    /**
     * Check database connection health
     *
     * @returns True if the database is healthy, false otherwise
     */
    healthCheck: () => Promise<boolean>;
}
