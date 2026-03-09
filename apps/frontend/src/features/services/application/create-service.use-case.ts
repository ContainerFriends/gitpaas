import { v4 as uuidv4 } from 'uuid';

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
export async function createServiceUseCase(repository: ServicesRepository, data: CreateServiceDto): Promise<Service> {
    const createDto: CreateServiceDto = {
        id: uuidv4(),
        name: data.name,
        projectId: data.projectId,
    };

    return repository.create(createDto);
}
