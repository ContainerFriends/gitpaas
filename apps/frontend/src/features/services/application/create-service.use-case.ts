import { CreateServiceDto } from '../domain/dtos/create-service.dto';
import { Service } from '../domain/models/service.models';
import { ServicesRepository } from '../domain/repositories/services.repository';

/**
 * Create service use case.
 *
 * @param repository Services repository
 * @param createDto Service creation data
 *
 * @return Created service
 */
export async function createServiceUseCase(
    repository: ServicesRepository,
    createDto: CreateServiceDto,
): Promise<Service> {
    return repository.create(createDto);
}