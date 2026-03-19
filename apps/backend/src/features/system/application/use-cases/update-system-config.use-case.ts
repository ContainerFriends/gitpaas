import { UpdateSystemConfigDto } from '../../domain/dtos/update-system-config.dto';
import { SystemRepository } from '../../domain/repositories/system.repository';

/**
 * Update system configuration use case
 *
 * @param repository System repository
 */
export async function updateSystemConfigUseCase(repository: SystemRepository): Promise<void> {
    const updateDto: UpdateSystemConfigDto = {
        installedAt: new Date(),
    };

    await repository.updateAppConfig(updateDto);
}
