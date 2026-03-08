import { Button } from '@shared/components/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@shared/components/form';
import { Input } from '@shared/components/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ReactNode } from 'react';

import { Service } from '../../domain/models/service.models';
import { CreateServiceFormData, UpdateServiceFormData } from '../models/service-form.models';
import { serviceFormSchema, ServiceFormSchema } from '../schemas/service.schemas';

interface ServiceFormProps {
    service?: Service;
    onSubmit: (data: ServiceFormSchema) => void;
    isSubmitting?: boolean;
    onCancel?: () => void;
}

/**
 * Service Form component
 */
export function ServiceForm({ service, onSubmit, isSubmitting = false, onCancel }: ServiceFormProps): ReactNode {
    const isEditing = Boolean(service);
    
    const form = useForm<ServiceFormSchema>({
        resolver: zodResolver(serviceFormSchema),
        defaultValues: {
            name: service?.name || '',
            repositoryUrl: service?.repositoryUrl || '',
            branch: service?.branch || '',
        },
    });

    const handleSubmit = (data: ServiceFormSchema): void => {
        onSubmit(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Service Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter service name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="repositoryUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Repository URL</FormLabel>
                            <FormControl>
                                <Input 
                                    type="url" 
                                    placeholder="https://github.com/username/repository" 
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="branch"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Branch (optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="main" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <div className="flex justify-end space-x-2 pt-4">
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                            Cancel
                        </Button>
                    )}
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update' : 'Create')} Service
                    </Button>
                </div>
            </form>
        </Form>
    );
}