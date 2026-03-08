import { UpdateProjectDto } from '../../domain/dtos/update-project.dto';
import { Project } from '../../domain/models/project.models';
import { ProjectRepository } from '../../domain/repositories/project.repository';
import { updateProjectUseCase } from '../use-cases/update-project.use-case';

/**
 * Update project orchestrator
 *
 * @param repository Project repository
 * @param updateDto Project update data
 *
 * @returns Updated project or null if not found
 */
export async function updateProjectOrchestrator(repository: ProjectRepository, updateDto: UpdateProjectDto): Promise<Project | null> {
    return updateProjectUseCase(repository, updateDto);
}
