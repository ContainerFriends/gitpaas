import { Service } from '../../domain/models/service.models';
import { ServicesRepository } from '../../domain/repositories/services.repository';

/**
 * Get service by ID use case.
 *
 * @param repository Services repository
 * @param id Service ID
 *
 * @return Service or null if not found
 */
export async function getServiceByIdUseCase(repository: ServicesRepository, id: string): Promise<Service | null> {
    return repository.getById(id);
}
