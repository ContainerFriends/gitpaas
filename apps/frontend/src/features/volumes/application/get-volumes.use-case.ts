import { Volume } from '../domain/models/volume.models';
import { VolumesRepository } from '../domain/repositories/volumes.repository';

/**
 * Get volumes use case.
 *
 * @param repository Volumes repository
 *
 * @return List of volumes
 */
export async function getVolumesUseCase(repository: VolumesRepository): Promise<Volume[]> {
    return repository.getAll();
}
