import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, GitBranch, LinkIcon, Save } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useServices } from '../hooks/useServices';
import { ServiceDetailFormData } from '../models/service-form.models';
import { serviceDetailFormSchema } from '../schemas/service.schemas';

import { Button } from '@shared/components/button';
import { Card, CardContent, CardHeader } from '@shared/components/card';
import { Input } from '@shared/components/input';
import { Label } from '@shared/components/label';

interface ServiceDetailContainerProps {
    serviceId: string;
    projectId: string;
}

/**
 * Service detail container component
 */
export function ServiceDetailContainer({ serviceId, projectId }: ServiceDetailContainerProps): ReactNode {
    const navigate = useNavigate();
    const { selectedService, loadingService, getServiceById, updateService } = useServices();
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<ServiceDetailFormData>({
        resolver: zodResolver(serviceDetailFormSchema),
        defaultValues: {
            name: '',
            repositoryUrl: '',
            branch: '',
        },
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = form;

    /**
     * Load service by ID
     */
    useEffect(() => {
        getServiceById(serviceId);
    }, [getServiceById, serviceId]);

    /**
     * Update form when service is loaded
     */
    useEffect(() => {
        if (selectedService?.id === serviceId) {
            reset({
                name: selectedService.name,
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
                <CardContent>
                    Aqui botones
                </CardContent>
            </Card>

            {/* Provider */}
            <Card className="cursor-default hover:border-border">
                <CardHeader>Provider</CardHeader>
                <CardContent>
                    <div className="max-w-2xl">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="repositoryUrl">Repository URL</Label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="repositoryUrl"
                                            placeholder="https://github.com/owner/repo"
                                            className="pl-9"
                                            {...register('repositoryUrl')}
                                        />
                                    </div>
                                    {errors.repositoryUrl && <p className="text-sm text-destructive">{errors.repositoryUrl.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="branch">Branch</Label>
                                    <div className="relative">
                                        <GitBranch className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="branch" placeholder="main" className="pl-9" {...register('branch')} />
                                    </div>
                                    {errors.branch && <p className="text-sm text-destructive">{errors.branch.message}</p>}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t">
                                <Button type="button" variant="outline" onClick={handleBack}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={!isDirty || isSaving}>
                                    <Save />
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
