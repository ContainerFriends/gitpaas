import { VolumeGateway } from '../../domain/gateways/volume.gateway';
import { Volume } from '../../domain/models/volume.models';
import { getAllVolumesUseCase } from '../use-cases/get-all-volumes.use-case';

/**
 * Get volumes orchestrator
 *
 * @param gateway Volume gateway
 *
 * @returns List of volumes
 */
export async function getVolumesOrchestrator(gateway: VolumeGateway): Promise<Volume[]> {
    return getAllVolumesUseCase(gateway);
}
