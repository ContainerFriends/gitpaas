import { Layers, Plus, Search } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Service } from '../../domain/models/service.models';
import { CreateServiceDialog } from '../components/CreateServiceDialog';
import { EditServiceDialog } from '../components/EditServiceDialog';
import { ServicesList } from '../components/ServicesList';
import { useServices } from '../hooks/useServices';

import { useProjects } from '@features/projects/ui/hooks/useProjects';
import { Button } from '@shared/components/button';

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

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    /**
     * Load project
     */
    useEffect(() => {
        getProjectById(projectId);
    }, [getProjectById, projectId]);

    /**
     * Load services when project is loaded
     */
    useEffect(() => {
        if (selectedProject?.id === projectId) {
            loadServicesByProjectId(projectId).catch(console.error);
        }
    }, [selectedProject, projectId, loadServicesByProjectId]);

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

    /**
     * Handle open create service dialog
     */
    const handleOpenCreateDialog = () => {
        setIsCreateDialogOpen(true);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Services</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">Loading services...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Services</h1>
                        <p className="text-sm text-destructive mt-0.5">Error: {error}</p>
                    </div>
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

    if (filteredServices.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Services</h1>
                    </div>
                    <Button size="sm" onClick={handleOpenCreateDialog}>
                        <Plus />
                        New service
                    </Button>
                </div>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                        <Layers className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No services found</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-sm">Get started by creating your first service.</p>
                    <Button onClick={handleOpenCreateDialog}>
                        <Plus />
                        Create your first service
                    </Button>
                </div>

                <CreateServiceDialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                    onSubmit={handleCreateSubmit}
                    isSubmitting={submittingService}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">Services</h1>
                </div>
                <Button size="sm" onClick={handleOpenCreateDialog}>
                    <Plus />
                    New service
                </Button>
            </div>

            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Filter services..."
                    value={filter}
                    className="h-8 w-full rounded-md border border-border bg-muted/50 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                />
            </div>

            <ServicesList
                services={filteredServices}
                onEdit={handleEditService}
                onDelete={handleDeleteService}
                onViewRepository={handleViewRepository}
            />

            <CreateServiceDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
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
