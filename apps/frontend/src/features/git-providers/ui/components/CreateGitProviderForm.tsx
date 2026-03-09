import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';

import { GitProviderFormData } from '../models/git-provider-form.models';
import { gitProviderFormSchema } from '../schemas/git-provider-form.schema';

import { Button } from '@shared/components/button';
import { Input } from '@shared/components/input';
import { Label } from '@shared/components/label';

interface GitProviderFormProps {
    onSubmit: (data: GitProviderFormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function CreateGitProviderForm({ onSubmit, onCancel, isLoading = false }: GitProviderFormProps): ReactNode {
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
                To integrate your GitHub account with our services, you&apos;ll need to create and install a GitHub app. This process is
                straightforward and only takes a few minutes. Click the button below to get started.
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
