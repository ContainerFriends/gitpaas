/**
 * Check if all required environment variables are set.
 *
 * @param requiredEnvVars Required environment variables
 */
export function checkRequiredEnvVariables(requiredEnvVars: string[]) {
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`❌ Missing environment variable: ${envVar}`);
        }
    }
}
