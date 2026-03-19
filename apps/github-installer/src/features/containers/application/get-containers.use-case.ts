import { Container } from '../domain/models/container.models';
import { ContainersRepository } from '../domain/repositories/containers.repository';

/**
 * Get containers use case.
 *
 * @param repository Containers repository
 *
 * @return List of containers
 */
export async function getContainersUseCase(repository: ContainersRepository): Promise<Container[]> {
    return repository.getAll();
}
