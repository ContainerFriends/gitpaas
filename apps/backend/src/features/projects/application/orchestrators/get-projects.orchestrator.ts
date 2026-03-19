import { Project } from '../../domain/models/project.models';
import { ProjectRepository } from '../../domain/repositories/project.repository';
import { getAllProjectsUseCase } from '../use-cases/get-all-projects.use-case';

/**
 * Get projects orchestrator
 *
 * @param repository Project repository
 *
 * @returns Project list
 */
export async function getProjectsOrchestrator(repository: ProjectRepository): Promise<Project[]> {
    return getAllProjectsUseCase(repository);
}
