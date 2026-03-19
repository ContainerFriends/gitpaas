import { Container } from '../../domain/models/container.models';

/**
 * Container Docker mapper
 */
export const containerDockerMapper = {
    /**
     * Maps Docker API container info to domain model
     *
     * @param dockerContainer Docker API container info
     *
     * @returns Container domain model
     */
    toDomain: (dockerContainer: any): Container => ({
        id: dockerContainer.Id,
        names: dockerContainer.Names,
        image: dockerContainer.Image,
        command: dockerContainer.Command,
        state: dockerContainer.State,
        status: dockerContainer.Status,
        ports: (dockerContainer.Ports || []).map((port: any) => ({
            ip: port.IP,
            privatePort: port.PrivatePort,
            publicPort: port.PublicPort,
            type: port.Type,
        })),
    }),
};
