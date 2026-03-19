import { NetworksRepository } from '../domain/repositories/networks.repository';

/**
 * Remove network use case.
 *
 * @param repository Networks repository
 * @param id Network ID
 *
 * @return Promise that resolves when removal is complete
 */
export async function removeNetworkUseCase(
    repository: NetworksRepository,
    id: string,
): Promise<void> {
    return repository.remove(id);
}