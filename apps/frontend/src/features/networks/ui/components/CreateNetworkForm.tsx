import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';

import { NetworkFormData } from '../models/network-form.models';
import { networkFormSchema } from '../schemas/network-form.schema';

import { Button } from '@shared/components/button';
import { Input } from '@shared/components/input';
import { Label } from '@shared/components/label';

interface NetworkFormProps {
    onSubmit: (data: NetworkFormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

/**
 * Network creation form component
 */
export function CreateNetworkForm({ onSubmit, onCancel, isLoading = false }: NetworkFormProps): ReactNode {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<NetworkFormData>({
        resolver: zodResolver(networkFormSchema),
        mode: 'onChange',
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="network-name">Name</Label>
                <Input id="network-name" placeholder="Enter network name..." disabled={isLoading} {...register('name')} />
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