import { ReactNode, useCallback } from 'react';
import { toast } from 'sonner';

import { createServiceUseCase } from '../../application/create-service.use-case';
import { deleteServiceUseCase } from '../../application/delete-service.use-case';
import { getServiceByIdUseCase } from '../../application/get-service-by-id.use-case';
import { getServicesByProjectIdUseCase } from '../../application/get-services-by-project-id.use-case';
import { updateServiceUseCase } from '../../application/update-service.use-case';
import { Service } from '../../domain/models/service.models';
import { servicesApiRepository } from '../../infrastructure/api/services-api.repository';
import { ServicesContext, ServicesContextValue } from '../context/ServicesContext';
import { useServicesState } from '../hooks/useServicesState';
import { ServiceFormData, EditServiceFormData, ServiceDetailFormData } from '../models/service-form.models';

interface ServicesProviderProps {
    children: ReactNode;
}

/**
 * Services provider
 */
export function ServicesProvider({ children }: ServicesProviderProps): ReactNode {
    const {
        state,
        setServices,
        addService,
        updateService,
        deleteService,
        setSelectedService,
        setLoadingService,
        setSubmittingService,
        setFilter,
        setLoading,
        setError,
        setProjectId,
    } = useServicesState();

    // Mock token for development - replace with Auth0 when available
    const getMockToken = useCallback(async (): Promise<string> => {
        return Promise.resolve('mock-token-for-development');
    }, []);

    /**
     * Load services by project ID
     */
    const loadServicesByProjectId = useCallback(
        async (projectId: string): Promise<void> => {
            try {
                setLoading(true);
                setError(null);
                setProjectId(projectId);
                const token = await getMockToken();
                const services = await getServicesByProjectIdUseCase(servicesApiRepository(token), projectId);
                setServices(services);
            } catch (error) {
                setError('Failed to load services');
                throw error;
            } finally {
                setLoading(false);
            }
        },
        [getMockToken, setLoading, setError, setProjectId, setServices],
    );

    /**
     * Get service by ID
     */
    const getServiceById = useCallback(
        async (id: string): Promise<Service | null> => {
            try {
                setLoadingService(true);
                setError(null);
                const token = await getMockToken();
                const service = await getServiceByIdUseCase(servicesApiRepository(token), id);
                setSelectedService(service);
                return service;
            } catch (error) {
                setError('Failed to load service');
                throw error;
            } finally {
                setLoadingService(false);
            }
        },
        [getMockToken, setLoadingService, setError, setSelectedService],
    );

    /**
     * Create a new service
     */
    const createService = useCallback(
        async (data: ServiceFormData): Promise<Service> => {
            try {
                setSubmittingService(true);
                setError(null);
                const token = await getMockToken();
                const newService = await createServiceUseCase(servicesApiRepository(token), { ...data, projectId: state.projectId });
                addService(newService);
                toast.success('Service created successfully');
                return newService;
            } catch (error) {
                setError('Failed to create service');
                toast.error('Failed to create service');
                throw error;
            } finally {
                setSubmittingService(false);
            }
        },
        [getMockToken, setSubmittingService, setError, addService, state.projectId],
    );

    /**
     * Update an existing service
     */
    const updateServiceHandler = useCallback(
        async (id: string, data: EditServiceFormData | ServiceDetailFormData): Promise<Service> => {
            try {
                setSubmittingService(true);
                setError(null);
                const token = await getMockToken();
                const updatedService = await updateServiceUseCase(servicesApiRepository(token), id, data);
                updateService(updatedService);
                return updatedService;
            } catch (error) {
                setError('Failed to update service');
                toast.error('Failed to update service');
                throw error;
            } finally {
                setSubmittingService(false);
            }
        },
        [getMockToken, setSubmittingService, setError, updateService],
    );

    /**
     * Delete a service
     */
    const deleteServiceHandler = useCallback(
        async (id: string): Promise<void> => {
            try {
                setSubmittingService(true);
                setError(null);
                const token = await getMockToken();
                await deleteServiceUseCase(servicesApiRepository(token), id);
                deleteService(id);
                toast.success('Service deleted successfully');
            } catch (error) {
                setError('Failed to delete service');
                toast.error('Failed to delete service');
                throw error;
            } finally {
                setSubmittingService(false);
            }
        },
        [getMockToken, setSubmittingService, setError, deleteService],
    );

    /**
     * Set filter for services
     */
    const setFilterHandler = useCallback(
        (filter: string): void => {
            setFilter(filter);
        },
        [setFilter],
    );

    const contextValue: ServicesContextValue = {
        services: state.services,
        filter: state.filter,
        loading: state.loading,
        error: state.error,
        filteredServices: state.filteredServices,
        selectedService: state.selectedService,
        loadingService: state.loadingService,
        submittingService: state.submittingService,
        projectId: state.projectId,
        loadServicesByProjectId,
        getServiceById,
        createService,
        updateService: updateServiceHandler,
        deleteService: deleteServiceHandler,
        setFilter: setFilterHandler,
    };

    return <ServicesContext.Provider value={contextValue}>{children}</ServicesContext.Provider>;
}
