import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';

import { ServiceFormData } from '../models/service-form.models';
import { serviceFormSchema } from '../schemas/service.schemas';

import { Button } from '@shared/components/button';
import { Input } from '@shared/components/input';
import { Label } from '@shared/components/label';

interface ServiceFormProps {
    onSubmit: (data: ServiceFormData) => void;
    onCancel?: () => void;
    isLoading?: boolean;
}

/**
 * Service Form component
 */
export function CreateServiceForm({ onSubmit, onCancel, isLoading = false }: ServiceFormProps): ReactNode {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<ServiceFormData>({
        resolver: zodResolver(serviceFormSchema),
        mode: 'onChange',
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="service-name">Name</Label>
                <Input id="service-name" placeholder="Enter service name..." disabled={isLoading} {...register('name')} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={!isValid || isLoading}>
                    {isLoading ? 'Creating...' : 'Create'}
                </Button>
            </div>
        </form>
    );
}
