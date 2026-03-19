import { CreateProjectDto } from '../../domain/dtos/create-project.dto';
import { Project } from '../../domain/models/project.models';
import { ProjectRepository } from '../../domain/repositories/project.repository';

/**
 * Create project use case.
 *
 * @param repository Project repository
 * @param createDto Project creation data
 *
 * @returns Created project
 */
export async function createProjectUseCase(repository: ProjectRepository, createDto: CreateProjectDto): Promise<Project> {
    return repository.create(createDto);
}
