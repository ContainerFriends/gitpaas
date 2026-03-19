import { UpdateServiceDto } from '../domain/dtos/update-service.dto';
import { Service } from '../domain/models/service.models';
import { ServicesRepository } from '../domain/repositories/services.repository';

/**
 * Update service use case.
 *
 * @param repository Services repository
 * @param id Service ID
 * @param data Service update data
 *
 * @return Updated service
 */
export async function updateServiceUseCase(repository: ServicesRepository, id: string, data: any): Promise<Service> {
    const updateDto: UpdateServiceDto = {
        name: data.name,
        gitProviderId: data.gitProviderId,
        repositoryId: data.repositoryId,
        branch: data.branch,
        composePath: data.composePath,
    };

    return repository.update(id, updateDto);
}
