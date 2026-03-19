import { ContainersRepository } from '../domain/repositories/containers.repository';

/**
 * Remove container use case.
 *
 * @param repository Containers repository
 * @param id Container ID
 *
 * @return Promise that resolves when removal is complete
 */
export async function removeContainerUseCase(repository: ContainersRepository, id: string): Promise<void> {
    return repository.remove(id);
}
