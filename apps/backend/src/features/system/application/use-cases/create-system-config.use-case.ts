import { v4 as uuidv4 } from 'uuid';

import { CreateSystemConfigDto } from '../../domain/dtos/create-system-config.dto';
import { SystemRepository } from '../../domain/repositories/system.repository';

/**
 * Create system configuration use case
 *
 * @param repository System repository
 * @param data System configuration data
 */
export async function createSystemConfigUseCase(repository: SystemRepository, data: any): Promise<void> {
    const createDto: CreateSystemConfigDto = {
        id: uuidv4(),
        traceId: data.traceId,
        appId: data.appId,
        privateKey: data.privateKey,
        webhookSecret: data.webhookSecret,
        appSlug: data.appSlug,
        initializedAt: data.initializedAt,
    };

    await repository.createAppConfig(createDto);
}
