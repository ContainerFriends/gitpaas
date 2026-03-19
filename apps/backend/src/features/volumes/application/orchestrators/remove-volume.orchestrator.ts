import { VolumeGateway } from '../../domain/gateways/volume.gateway';
import { removeVolumeUseCase } from '../use-cases/remove-volume.use-case';

/**
 * Remove volume orchestrator
 *
 * @param gateway Volume gateway
 * @param name Volume name
 *
 * @returns Success status
 */
export async function removeVolumeOrchestrator(gateway: VolumeGateway, name: string): Promise<boolean> {
    return removeVolumeUseCase(gateway, name);
}
