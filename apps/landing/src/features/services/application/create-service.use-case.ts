import { v4 as uuidv4 } from 'uuid';

import { CreateServiceDto } from '../domain/dtos/create-service.dto';
import { Service } from '../domain/models/service.models';
import { ServicesRepository } from '../domain/repositories/services.repository';

/**
 * Create service use case.
 *
 * @param repository Services repository
 * @param data Service creation data
 *
 * @return Created service
 */
export async function createServiceUseCase(repository: ServicesRepository, data: any): Promise<Service> {
    const createDto: CreateServiceDto = {
        id: uuidv4(),
        name: data.name,
        type: data.type,
        projectId: data.projectId,
    };

    return repository.create(createDto);
}
