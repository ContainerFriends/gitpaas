/* eslint-disable pii/no-ip */
/**
 * Configuration settings for the Express application.
 */
export const expressConfig = {
    port: process.env.PORT || 3001,
    host: process.env.HOST || '0.0.0.0',
    environment: process.env.ENVIRONMENT || 'development',
    apiVersion: process.env.API_VERSION || 'v1',
};
