import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';

import { ServiceType } from '../../domain/models/service.models';
import { ServiceFormData } from '../models/service-form.models';
import { serviceFormSchema } from '../schemas/service.schemas';

import { Button } from '@shared/components/button';
import { Input } from '@shared/components/input';
import { Label } from '@shared/components/label';

interface ServiceFormProps {
    type: ServiceType;
    onSubmit: (data: ServiceFormData) => void;
    onCancel?: () => void;
    onBack?: () => void;
    isLoading?: boolean;
}

/**
 * Service Form component
 */
// eslint-disable-next-line object-curly-newline
export function CreateServiceForm({ type, onSubmit, onCancel, onBack, isLoading = false }: ServiceFormProps): ReactNode {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<ServiceFormData>({
        resolver: zodResolver(serviceFormSchema),
        mode: 'onChange',
        defaultValues: {
            type,
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="service-name">Name</Label>
                <Input id="service-name" placeholder="Enter service name..." disabled={isLoading} {...register('name')} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="flex justify-between pt-4">
                <div>
                    {onBack && (
                        <Button type="button" variant="ghost" size="sm" onClick={onBack} disabled={isLoading}>
                            <ArrowLeft />
                            Back
                        </Button>
                    )}
                </div>
                <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={!isValid || isLoading}>
                        {isLoading ? 'Creating...' : 'Create'}
                    </Button>
                </div>
            </div>
        </form>
    );
}
