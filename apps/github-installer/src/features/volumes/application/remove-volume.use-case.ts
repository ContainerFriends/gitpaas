import { VolumesRepository } from '../domain/repositories/volumes.repository';

/**
 * Remove volume use case.
 *
 * @param repository Volumes repository
 * @param name Volume name
 *
 * @return Promise that resolves when removal is complete
 */
export async function removeVolumeUseCase(repository: VolumesRepository, name: string): Promise<void> {
    return repository.remove(name);
}
