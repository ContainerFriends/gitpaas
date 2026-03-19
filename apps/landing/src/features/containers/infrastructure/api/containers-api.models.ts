/**
 * Container port API model
 */
export interface ApiContainerPort {
    ip: string;
    privatePort: number;
    publicPort: number;
    type: string;
}

/**
 * Container API model
 */
export interface ApiContainer {
    id: string;
    names: string[];
    image: string;
    command: string;
    state: string;
    status: string;
    ports: ApiContainerPort[];
}
