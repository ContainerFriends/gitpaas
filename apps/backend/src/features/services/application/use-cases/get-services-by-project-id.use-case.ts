import { Service } from '../../domain/models/service.models';
import { ServicesRepository } from '../../domain/repositories/services.repository';

/**
 * Get services by project ID use case.
 *
 * @param repository Services repository
 * @param projectId Project ID
 *
 * @return List of services for the project
 */
export async function getServicesByProjectIdUseCase(repository: ServicesRepository, projectId: string): Promise<Service[]> {
    return repository.getByProjectId(projectId);
}
