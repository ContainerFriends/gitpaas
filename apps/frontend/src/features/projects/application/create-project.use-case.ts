import { CreateProjectDto } from '../domain/dtos/create-project.dto';
import { Project } from '../domain/models/projects.models';
import { ProjectsRepository } from '../domain/repositories/projects.repository';

/**
 * Create project use case.
 *
 * @param repository Projects repository
 * @param data Project data to create
 */
export async function createProjectUseCase(repository: ProjectsRepository, data: { name: string }): Promise<Project> {
    const createDto: CreateProjectDto = {
        id: crypto.randomUUID(),
        name: data.name,
    };

    return repository.create(createDto);
}
