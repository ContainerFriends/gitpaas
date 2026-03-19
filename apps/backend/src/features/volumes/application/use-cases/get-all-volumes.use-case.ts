import { VolumeGateway } from '../../domain/gateways/volume.gateway';
import { Volume } from '../../domain/models/volume.models';

/**
 * Get all volumes use case
 *
 * @param gateway Volume gateway
 *
 * @returns List of volumes
 */
export async function getAllVolumesUseCase(gateway: VolumeGateway): Promise<Volume[]> {
    return gateway.getAllVolumes();
}
