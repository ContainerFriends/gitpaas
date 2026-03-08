import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Service } from '../../domain/models/service.models';
import { CreateServiceDialog } from '../components/CreateServiceDialog';
import { EditServiceDialog } from '../components/EditServiceDialog';
import { ServicesHeader } from '../components/ServicesHeader';
import { ServicesList } from '../components/ServicesList';
import { useServices } from '../hooks/useServices';
import { ServiceFormSchema } from '../schemas/service.schemas';

import { useProjects } from '@features/projects/ui/hooks/useProjects';

interface ServicesContainerProps {
    projectId: string;
}

/**
 * Services Container component
 */
export function ServicesContainer({ projectId }: ServicesContainerProps): ReactNode {
    const { selectedProject, getProjectById } = useProjects();
    const {
        filteredServices,
        filter,
        loading,
        error,
        submittingService,
        loadServicesByProjectId,
        createService,
        updateService,
        deleteService,
        setFilter,
    } = useServices();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    /**
     * Load project
     */
    useEffect(() => {
        getProjectById(projectId);
    }, [getProjectById, projectId]);

    const handleCreateService = (): void => {
        setCreateDialogOpen(true);
    };

    const handleCreateSubmit = async (data: ServiceFormSchema): Promise<void> => {
        try {
            await createService(data);
            setCreateDialogOpen(false);
        } catch {
            toast.error('Failed to create service:');
        }
    };

    const handleEditService = (service: Service): void => {
        setSelectedService(service);
        setEditDialogOpen(true);
    };

    const handleEditSubmit = async (data: ServiceFormSchema): Promise<void> => {
        if (!selectedService) return;

        try {
            await updateService(selectedService.id, data);
            setEditDialogOpen(false);
            setSelectedService(null);
        } catch (error) {
            console.error('Failed to update service:', error);
        }
    };

    const handleDeleteService = async (serviceId: string): Promise<void> => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                await deleteService(serviceId);
            } catch (error) {
                console.error('Failed to delete service:', error);
            }
        }
    };

    const handleViewRepository = (repositoryUrl: string): void => {
        window.open(repositoryUrl, '_blank', 'noopener,noreferrer');
    };

    const handleEditDialogClose = (open: boolean): void => {
        setEditDialogOpen(open);
        if (!open) {
            setSelectedService(null);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <ServicesHeader
                    filter={filter}
                    onFilterChange={setFilter}
                    onCreateService={handleCreateService}
                    servicesCount={0}
                    projectName={selectedProject.name}
                />
                <div className="text-center py-8">
                    <p className="text-gray-500">Loading services...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <ServicesHeader
                    filter={filter}
                    onFilterChange={setFilter}
                    onCreateService={handleCreateService}
                    servicesCount={0}
                    projectName={selectedProject.name}
                />
                <div className="text-center py-8">
                    <p className="text-red-500">Error: {error}</p>
                </div>
            </div>
        );
    }

    if (!selectedProject) {
        return (
            <div className="space-y-4">
                <div className="text-center py-8">No project selected</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <ServicesHeader
                filter={filter}
                onFilterChange={setFilter}
                onCreateService={handleCreateService}
                servicesCount={filteredServices.length}
                projectName={selectedProject.name}
            />

            <ServicesList
                services={filteredServices}
                onEdit={handleEditService}
                onDelete={handleDeleteService}
                onViewRepository={handleViewRepository}
            />

            <CreateServiceDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSubmit={handleCreateSubmit}
                isSubmitting={submittingService}
            />

            <EditServiceDialog
                open={editDialogOpen}
                onOpenChange={handleEditDialogClose}
                service={selectedService}
                onSubmit={handleEditSubmit}
                isSubmitting={submittingService}
            />
        </div>
    );
}
