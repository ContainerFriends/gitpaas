import { CreateServiceDto } from '../../domain/dtos/create-service.dto';
import { Service } from '../../domain/models/service.models';
import { ServicesRepository } from '../../domain/repositories/services.repository';

/**
 * Create service use case.
 *
 * @param repository Services repository
 * @param createDto Service creation data
 *
 * @return Created service
 */
export async function createServiceUseCase(repository: ServicesRepository, data: any): Promise<Service> {
    const createDto: CreateServiceDto = {
        id: data.id,
        name: data.name,
        repositoryId: data.repositoryId,
        branch: data.branch,
        projectId: data.projectId,
    };

    return repository.create(createDto);
}
