import { Service } from '../../domain/models/service.models';
import { ServicesRepository } from '../../domain/repositories/services.repository';

/**
 * Get all services use case.
 *
 * @param repository Services repository
 *
 * @return List of services
 */
export async function getAllServicesUseCase(repository: ServicesRepository): Promise<Service[]> {
    return repository.getAll();
}
