import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { ServiceType } from '../../domain/models/service.models';
import { ServiceConfiguration } from '../components/ServiceConfiguration';
import { ServiceProvider } from '../components/ServiceProvider';
import { useServices } from '../hooks/useServices';
import { ServiceDetailFormData } from '../models/service-form.models';
import { serviceDetailFormSchema } from '../schemas/service.schemas';

import { useGitProviders } from '@features/git-providers/ui/hooks/useGitProviders';
import { useProjects } from '@features/projects/ui/hooks/useProjects';
import { RepositoriesProvider } from '@features/repositories/ui/providers/RepositoriesProvider';
import { useBreadcrumbMetadata } from '@layout/contexts/BreadcrumbContext';
import { Badge } from '@shared/components/badge';
import { Button } from '@shared/components/button';
import { Card, CardContent, CardHeader } from '@shared/components/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/components/tabs';

interface ServiceDetailContainerProps {
    serviceId: string;
    projectId: string;
}

/**
 * Service detail container component
 */
export function ServiceDetailContainer({ serviceId, projectId }: ServiceDetailContainerProps): ReactNode {
    const navigate = useNavigate();
    const { selectedProject, getProjectById } = useProjects();
    const { selectedService, loadingService, getServiceById, updateService } = useServices();
    const { gitProviders, loadGitProviders } = useGitProviders();
    const [isSaving, setIsSaving] = useState(false);

    const serviceTypeLabels: Record<ServiceType, string> = {
        docker_compose: 'Docker Compose',
    };

    /**
     * Register project and service names in breadcrumbs
     */
    useBreadcrumbMetadata(projectId, selectedProject?.name);
    useBreadcrumbMetadata(serviceId, selectedService?.name);

    const form = useForm<ServiceDetailFormData>({
        resolver: zodResolver(serviceDetailFormSchema),
        defaultValues: {
            name: '',
            gitProviderId: '',
            repositoryId: '',
            branch: '',
            composePath: '',
        },
    });

    const { reset, watch } = form;

    const selectedGitProviderId = watch('gitProviderId');
    const selectedRepositoryId = watch('repositoryId');

    /**
     * Load project, service, and git providers
     */
    useEffect(() => {
        getProjectById(projectId);
        getServiceById(serviceId);
        loadGitProviders();
    }, [getProjectById, getServiceById, loadGitProviders, projectId, serviceId]);

    /**
     * Update form when service is loaded
     */
    useEffect(() => {
        if (selectedService?.id === serviceId) {
            reset({
                name: selectedService.name,
                gitProviderId: selectedService.gitProviderId || '',
                repositoryId: selectedService.repositoryId || '',
                branch: selectedService.branch || '',
                composePath: selectedService.composePath || '',
            });
        }
    }, [selectedService, serviceId, reset]);

    /**
     * Handle form submission
     */
    const onSubmit = async (data: ServiceDetailFormData) => {
        if (!selectedService) return;

        setIsSaving(true);
        try {
            await updateService(selectedService.id, data);
            toast.success('Service updated successfully');
        } catch {
            toast.error('Failed to update service');
        } finally {
            setIsSaving(false);
        }
    };

    /**
     * Handle back navigation
     */
    const handleBack = () => {
        navigate(`/projects/${projectId}/services`);
    };

    if (loadingService) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={handleBack}>
                        <ArrowLeft />
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Service Details</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">Loading service...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!selectedService) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={handleBack}>
                        <ArrowLeft />
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Service Details</h1>
                        <p className="text-sm text-destructive mt-0.5">Service not found</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-semibold tracking-tight">{selectedService.name}</h1>
                    <Badge variant="secondary">{serviceTypeLabels[selectedService.type]}</Badge>
                </div>
                <Link to={`/projects/${projectId}/services`}>
                    <Button size="sm">
                        <ArrowLeft />
                        Back to Services
                    </Button>
                </Link>
            </div>

            <Tabs defaultValue="general">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="deployments">Deployments</TabsTrigger>
                    <TabsTrigger value="logs">Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                    {/* Deploy */}
                    <Card className="cursor-default hover:border-border">
                        <CardHeader>Deploy</CardHeader>
                        <CardContent>Aqui botones</CardContent>
                    </Card>

                    {/* Provider */}
                    <FormProvider {...form}>
                        <RepositoriesProvider>
                            <ServiceProvider
                                gitProviders={gitProviders}
                                selectedGitProviderId={selectedGitProviderId}
                                selectedRepositoryId={selectedRepositoryId}
                                onSubmit={onSubmit}
                                isSaving={isSaving}
                            />
                        </RepositoriesProvider>

                        {/* Configuration */}
                        {selectedService.type === 'docker_compose' && <ServiceConfiguration isSaving={isSaving} onSubmit={onSubmit} />}
                    </FormProvider>
                </TabsContent>
            </Tabs>
        </div>
    );
}
