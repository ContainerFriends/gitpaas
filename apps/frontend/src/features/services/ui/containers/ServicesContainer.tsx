import { Layers, Plus, Search } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { CreateServiceDialog } from '../components/CreateServiceDialog';
import { ServiceCard } from '../components/ServiceCard';
import { useServices } from '../hooks/useServices';
import { ServiceFormData } from '../models/service-form.models';

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
    // eslint-disable-next-line object-curly-newline
    const { filteredServices, filter, loading, error, loadServicesByProjectId, createService, updateService, deleteService } = useServices();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

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
            loadServicesByProjectId(projectId);
        }
    }, [selectedProject, projectId, loadServicesByProjectId]);

    /**
     * Handle edit service action
     */
    const handleEditService = async (serviceId: string) => {
        try {
            /* await getProjectById(projectId);
            setIsEditDialogOpen(true); */
        } catch {
            toast.error('Failed to edit service');
        }
    };

    /**
     * Handle delete service action
     */
    const handleDeleteService = async (serviceId: string) => {
        try {
            /* await deleteProject(projectId);
            await loadProjects();
            toast.success('Project deleted successfully'); */
        } catch {
            toast.error('Failed to delete service');
        }
    };

    /**
     * Handle create service form submission
     */
    const handleCreateService = async (data: ServiceFormData) => {
        setIsCreating(true);
        try {
            await createService(data);
            await loadServicesByProjectId(projectId);
            setIsCreateDialogOpen(false);
        } catch {
            toast.error('Failed to create service');
        } finally {
            setIsCreating(false);
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

    if (filteredServices.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Services</h1>
                    </div>
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
                    onSubmit={handleCreateService}
                    isLoading={isCreating}
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

            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredServices.map((service) => (
                    <ServiceCard key={service.id} service={service} onEdit={handleEditService} onDelete={handleDeleteService} />
                ))}
            </div>

            <CreateServiceDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onSubmit={handleCreateService}
                isLoading={isCreating}
            />

            {/* <EditServiceDialog
                open={editDialogOpen}
                onOpenChange={handleEditDialogClose}
                service={selectedService}
                onSubmit={handleEditSubmit}
                isSubmitting={submittingService}
            /> */}
        </div>
    );
}
