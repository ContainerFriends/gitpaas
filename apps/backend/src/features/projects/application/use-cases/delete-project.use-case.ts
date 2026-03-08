import { ProjectRepository } from '../../domain/repositories/project.repository';

/**
 * Delete project use case.
 *
 * @param repository Project repository
 * @param id Project ID
 *
 * @returns Whether project was deleted
 */
export async function deleteProjectUseCase(repository: ProjectRepository, id: string): Promise<boolean> {
    return repository.delete(id);
}
