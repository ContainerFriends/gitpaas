import { Service } from '../../domain/models/service.models';
import { ServicesRepository } from '../../domain/repositories/services.repository';
import { getAllServicesUseCase } from '../use-cases/get-all-services.use-case';

/**
 * Get services orchestrator
 *
 * @param repository Services repository
 *
 * @return List of services
 */
export async function getServicesOrchestrator(repository: ServicesRepository): Promise<Service[]> {
    return getAllServicesUseCase(repository);
}
