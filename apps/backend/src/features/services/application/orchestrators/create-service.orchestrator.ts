import { Service } from '../../domain/models/service.models';
import { ServicesRepository } from '../../domain/repositories/services.repository';
import { createServiceUseCase } from '../use-cases/create-service.use-case';

/**
 * Create service orchestrator
 *
 * @param repository Services repository
 * @param data Service creation data
 *
 * @return Created service
 */
export async function createServiceOrchestrator(repository: ServicesRepository, data: any): Promise<Service> {
    return createServiceUseCase(repository, data);
}
