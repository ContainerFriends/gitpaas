import { Project } from '../../domain/models/project.models';
import { ProjectRepository } from '../../domain/repositories/project.repository';
import { getProjectByIdUseCase } from '../use-cases/get-project-by-id.use-case';

/**
 * Get project by ID orchestrator
 *
 * @param repository Project repository
 * @param id Project ID
 *
 * @returns Project or null if not found
 */
export async function getProjectByIdOrchestrator(repository: ProjectRepository, id: string): Promise<Project | null> {
    return getProjectByIdUseCase(repository, id);
}
