/**
 * Container port model
 */
export interface ContainerPort {
    ip: string;
    privatePort: number;
    publicPort: number;
    type: string;
}

/**
 * Container model
 */
export interface Container {
    id: string;
    names: string[];
    image: string;
    command: string;
    state: string;
    status: string;
    ports: ContainerPort[];
}
