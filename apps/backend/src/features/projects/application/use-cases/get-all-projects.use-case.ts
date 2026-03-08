import { Project } from '../../domain/models/project.models';
import { ProjectRepository } from '../../domain/repositories/project.repository';

/**
 * Get all projects use case.
 *
 * @param repository Project repository
 *
 * @returns Project list
 */
export async function getAllProjectsUseCase(repository: ProjectRepository): Promise<Project[]> {
    return repository.getAll();
}
