import { CreateSystemConfigDto } from '../dtos/create-system-config.dto';
import { UpdateSystemConfigDto } from '../dtos/update-system-config.dto';
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

    /**
     * Create system configuration
     *
     * @param createDto System configuration creation DTO
     */
    createAppConfig: (createDto: CreateSystemConfigDto) => Promise<void>;

    /**
     * Update system configuration
     *
     * @param updateDto System configuration update DTO
     */
    updateAppConfig: (updateDto: UpdateSystemConfigDto) => Promise<void>;
}
