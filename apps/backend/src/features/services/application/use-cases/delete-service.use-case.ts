import { ServicesRepository } from '../../domain/repositories/services.repository';

/**
 * Delete service use case.
 *
 * @param repository Services repository
 * @param id Service ID
 *
 * @return Promise that resolves when deletion is complete
 */
export async function deleteServiceUseCase(repository: ServicesRepository, id: string): Promise<void> {
    return repository.delete(id);
}
