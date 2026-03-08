import { ProjectRepository } from '../../domain/repositories/project.repository';
import { deleteProjectUseCase } from '../use-cases/delete-project.use-case';

/**
 * Delete project orchestrator
 *
 * @param repository Project repository
 * @param id Project ID
 *
 * @returns Whether project was deleted
 */
export async function deleteProjectOrchestrator(repository: ProjectRepository, id: string): Promise<boolean> {
    return deleteProjectUseCase(repository, id);
}
