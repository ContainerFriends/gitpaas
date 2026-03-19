import { Project } from '../domain/models/projects.models';
import { ProjectsRepository } from '../domain/repositories/projects.repository';

/**
 * Get project by ID use case.
 *
 * @param repository Projects repository
 * @param id Project ID
 *
 * @return Project or null if not found
 */
export async function getProjectByIdUseCase(repository: ProjectsRepository, id: string): Promise<Project | null> {
    return repository.getById(id);
}
