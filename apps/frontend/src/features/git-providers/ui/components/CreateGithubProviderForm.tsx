import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';

import { GitProviderFormData } from '../models/git-provider-form.models';
import { gitProviderFormSchema } from '../schemas/git-provider-form.schema';

import { Button } from '@shared/components/button';
import { Input } from '@shared/components/input';
import { Label } from '@shared/components/label';

interface CreateGithubProviderFormProps {
    onSubmit: (data: GitProviderFormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

/**
 * Create GitHub provider form component
 */
export function CreateGithubProviderForm({ onSubmit, onCancel, isLoading = false }: CreateGithubProviderFormProps): ReactNode {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<GitProviderFormData>({
        resolver: zodResolver(gitProviderFormSchema),
        mode: 'onChange',
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="text-sm text-muted-foreground">
                To connect your GitHub account to GitPaaS, you need to create and install a new GitHub App. This will give you visibility control at
                all times.
            </div>
            <div className="space-y-2">
                <Label htmlFor="git-provider-name">Name</Label>
                <Input id="git-provider-name" placeholder="Enter name for the provider..." disabled={isLoading} {...register('name')} />
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
