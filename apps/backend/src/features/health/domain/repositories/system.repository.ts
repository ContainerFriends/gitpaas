import { SystemConfig } from '../models/system.models';

/**
 * System repository
 */
export interface SystemRepository {
    /**
     * Get system configuration
     *
     * @returns System configuration
     */
    getAppConfig: () => Promise<SystemConfig | null>;
}
