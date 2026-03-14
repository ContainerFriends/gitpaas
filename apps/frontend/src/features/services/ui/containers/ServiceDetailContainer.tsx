import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { ServiceProvider } from '../components/ServiceProvider';
import { useServices } from '../hooks/useServices';
import { ServiceDetailFormData } from '../models/service-form.models';
import { serviceDetailFormSchema } from '../schemas/service.schemas';

import { useGitProviders } from '@features/git-providers/ui/hooks/useGitProviders';
import { useProjects } from '@features/projects/ui/hooks/useProjects';
import { useBreadcrumbMetadata } from '@layout/contexts/BreadcrumbContext';
import { Button } from '@shared/components/button';
import { Card, CardContent, CardHeader } from '@shared/components/card';

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
            repositoryUrl: '',
            branch: '',
        },
    });

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isDirty },
    } = form;

    const selectedGitProviderId = watch('gitProviderId');

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
                gitProviderId: '',
                repositoryUrl: selectedService.repositoryUrl || '',
                branch: selectedService.branch || '',
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
            navigate(`/projects/${projectId}/services`);
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
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">{selectedService.name}</h1>
                </div>
                <Link to={`/projects/${projectId}/services`}>
                    <Button size="sm">
                        <ArrowLeft />
                        Back to Services
                    </Button>
                </Link>
            </div>

            {/* Deploy */}
            <Card className="cursor-default hover:border-border">
                <CardHeader>Deploy</CardHeader>
                <CardContent>Aqui botones</CardContent>
            </Card>

            {/* Provider */}
            <ServiceProvider
                gitProviders={gitProviders}
                selectedGitProviderId={selectedGitProviderId}
                register={register}
                errors={errors}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                isDirty={isDirty}
                isSaving={isSaving}
            />
        </div>
    );
}
