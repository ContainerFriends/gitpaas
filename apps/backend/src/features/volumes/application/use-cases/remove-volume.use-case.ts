import { VolumeGateway } from '../../domain/gateways/volume.gateway';

/**
 * Remove volume use case
 *
 * @param gateway Volume gateway
 * @param name Volume name
 *
 * @returns Success status
 */
export async function removeVolumeUseCase(gateway: VolumeGateway, name: string): Promise<boolean> {
    return gateway.removeVolume(name);
}
