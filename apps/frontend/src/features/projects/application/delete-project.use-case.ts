import { ProjectsRepository } from '../domain/repositories/projects.repository';

/**
 * Delete project use case.
 *
 * @param repository Projects repository
 * @param id Project ID
 */
export async function deleteProjectUseCase(repository: ProjectsRepository, id: string): Promise<void> {
    return repository.delete(id);
}
