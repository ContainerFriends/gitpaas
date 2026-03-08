import { ConfigurationError } from '../../domain/errors/configuration.error';

/**
 * Validate CORS configuration for production environment
 *
 * Ensures that CORS is properly restricted in production
 */
export function validateCorsConfig(corsOrigin: string, environment: string): void {
    const isProduction = environment === 'production';
    const isWildcard = corsOrigin === '*';

    if (isProduction && isWildcard) {
        throw new ConfigurationError('CORS_ORIGIN cannot be "*" in production environment. Please specify allowed origins.');
    }
}
