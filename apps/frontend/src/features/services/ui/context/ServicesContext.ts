import { createContext } from 'react';

import { Service } from '../../domain/models/service.models';

/**
 * Services context model
 */
export interface ServicesContextValue {
    services: Service[];
    filter: string;
    loading: boolean;
    error: string | null;
    filteredServices: Service[];
    selectedService: Service | null;
    loadingService: boolean;
    submittingService: boolean;
    projectId: string | null;
    loadServicesByProjectId: (projectId: string) => Promise<void>;
    getServiceById: (id: string) => Promise<Service | null>;
    createService: (data: { name: string; repositoryUrl: string; branch?: string }) => Promise<Service>;
    updateService: (id: string, data: { name?: string; repositoryUrl?: string; branch?: string }) => Promise<Service>;
    deleteService: (id: string) => Promise<void>;
    setFilter: (filter: string) => void;
}

/**
 * Services context
 */
export const ServicesContext = createContext<ServicesContextValue | undefined>(undefined);