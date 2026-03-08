import { Project } from '../../domain/models/project.models';
import { ProjectRepository } from '../../domain/repositories/project.repository';

/**
 * Get project by ID use case.
 *
 * @param repository Project repository
 * @param id Project ID
 *
 * @returns Project or null if not found
 */
export async function getProjectByIdUseCase(repository: ProjectRepository, id: string): Promise<Project | null> {
    return repository.getById(id);
}
