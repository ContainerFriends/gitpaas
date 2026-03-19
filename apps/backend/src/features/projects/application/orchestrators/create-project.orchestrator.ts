import { CreateProjectDto } from '../../domain/dtos/create-project.dto';
import { Project } from '../../domain/models/project.models';
import { ProjectRepository } from '../../domain/repositories/project.repository';
import { createProjectUseCase } from '../use-cases/create-project.use-case';

/**
 * Create project orchestrator
 *
 * @param repository Project repository
 * @param createDto Project creation data
 *
 * @returns Created project
 */
export async function createProjectOrchestrator(repository: ProjectRepository, createDto: CreateProjectDto): Promise<Project> {
    return createProjectUseCase(repository, createDto);
}
