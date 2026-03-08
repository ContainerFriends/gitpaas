import { UpdateServiceDto } from '../domain/dtos/update-service.dto';
import { Service } from '../domain/models/service.models';
import { ServicesRepository } from '../domain/repositories/services.repository';

/**
 * Update service use case.
 *
 * @param repository Services repository
 * @param id Service ID
 * @param updateDto Service update data
 *
 * @return Updated service
 */
export async function updateServiceUseCase(
    repository: ServicesRepository,
    id: string,
    updateDto: UpdateServiceDto,
): Promise<Service> {
    return repository.update(id, updateDto);
}