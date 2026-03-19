/**
 * Configuration error class for frontend
 */
class ConfigurationError extends Error {
    public isConfigurationError = true;

    public errorData: any;

    constructor(message: string, errorData: any) {
        super(`Configuration Error: ${message}`);
        this.name = 'ConfigurationError';
        this.errorData = errorData;
    }
}

/**
 * Handles HTTP response errors and throws appropriate error types
 *
 * @param response HTTP response object
 * @param operationName Description of the operation (e.g., 'fetch organizations')
 *
 * @throws ConfigurationError when GitHub token is not configured
 * @throws Error for other HTTP errors
 */
export async function handleHttpError(response: Response, operationName: string): Promise<void> {
    if (response.ok) {
        return;
    }

    if (response.status === 500) {
        try {
            const errorData = await response.json();
            if (errorData.error === 'Configuration Error') {
                throw new ConfigurationError(errorData.message, errorData);
            }

            // Re-throw as generic server error
            throw new Error(`Server error: ${errorData.message || response.statusText}`);
        } catch (parseError) {
            if (parseError instanceof ConfigurationError) {
                throw parseError;
            }

            throw new Error(`Failed to ${operationName}: ${response.statusText}`);
        }
    }

    // For non-500 errors, throw generic error
    throw new Error(`Failed to ${operationName}: ${response.statusText}`);
}

/**
 * Type guard to check if error is a configuration error
 */
export function isConfigurationError(error: any): error is ConfigurationError {
    return error instanceof ConfigurationError || (error instanceof Error && (error as any).isConfigurationError === true);
}
