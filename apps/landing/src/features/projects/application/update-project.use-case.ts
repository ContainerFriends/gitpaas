import { UpdateProjectDto } from '../domain/dtos/update-project.dto';
import { Project } from '../domain/models/projects.models';
import { ProjectsRepository } from '../domain/repositories/projects.repository';

/**
 * Update project use case.
 *
 * @param repository Projects repository
 * @param id Project ID
 * @param data Project data to update
 */
export async function updateProjectUseCase(repository: ProjectsRepository, id: string, data: { name: string }): Promise<Project> {
    const updateDto: UpdateProjectDto = {
        name: data.name,
    };

    return repository.update(id, updateDto);
}
