import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { ServiceFormData } from '../models/service-form.models';
import { serviceFormSchema } from '../schemas/service.schemas';

import { Button } from '@shared/components/button';
import { Input } from '@shared/components/input';
import { Label } from '@shared/components/label';

interface EditServiceFormProps {
    initialData: ServiceFormData;
    isLoading?: boolean;
    onSubmit: (data: ServiceFormData) => void;
    onCancel: () => void;
}

/**
 * Service edit form component
 */
export function EditServiceForm({ initialData, onSubmit, onCancel, isLoading = false }: EditServiceFormProps): ReactNode {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm<ServiceFormData>({
        resolver: zodResolver(serviceFormSchema),
        mode: 'onChange',
        defaultValues: initialData,
    });

    useEffect(() => {
        reset(initialData);
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="edit-service-name">Name</Label>
                <Input id="edit-service-name" placeholder="Enter service name..." disabled={isLoading} {...register('name')} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={!isValid || isLoading}>
                    {isLoading ? 'Updating...' : 'Update'}
                </Button>
            </div>
        </form>
    );
}
