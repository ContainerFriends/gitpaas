import { UpdateProjectDto } from '../../domain/dtos/update-project.dto';
import { Project } from '../../domain/models/project.models';
import { ProjectRepository } from '../../domain/repositories/project.repository';

/**
 * Update project use case.
 *
 * @param repository Project repository
 * @param updateDto Project update data
 *
 * @returns Updated project or null if not found
 */
export async function updateProjectUseCase(repository: ProjectRepository, updateDto: UpdateProjectDto): Promise<Project | null> {
    return repository.update(updateDto);
}
