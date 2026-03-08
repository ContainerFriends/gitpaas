import { Project } from '../domain/models/projects.models';
import { ProjectsRepository } from '../domain/repositories/projects.repository';

/**
 * Get projects use case.
 *
 * @param repository Projects repository
 *
 * @return List of projects
 */
export async function getProjectsUseCase(repository: ProjectsRepository): Promise<Project[]> {
    return repository.getAll();
}
