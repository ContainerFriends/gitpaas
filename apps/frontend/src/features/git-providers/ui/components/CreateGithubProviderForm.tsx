import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { GithubGitProviderFormData } from '../models/git-provider-form.models';
import { githubGitProviderFormSchema } from '../schemas/github-git-provider-form.schema';

import { Button } from '@shared/components/button';
import { Checkbox } from '@shared/components/Checkbox';
import { Input } from '@shared/components/input';
import { Label } from '@shared/components/label';

interface CreateGithubProviderFormProps {
    onSubmit: (data: GithubGitProviderFormData) => void;
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
        control,
        watch,
        formState: { errors, isValid },
    } = useForm<GithubGitProviderFormData>({
        resolver: zodResolver(githubGitProviderFormSchema),
        mode: 'onChange',
        defaultValues: {
            isOrganization: false,
        },
    });

    const isOrganization = watch('isOrganization');

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

            {isOrganization && (
                <div className="space-y-2">
                    <Label htmlFor="organization-name">Organization name</Label>
                    <Input id="organization-name" placeholder="Enter organization name..." disabled={isLoading} {...register('organizationName')} />
                    {errors.organizationName && <p className="text-sm text-destructive">{errors.organizationName.message}</p>}
                </div>
            )}

            <div className="flex items-center space-x-2">
                <Controller
                    name="isOrganization"
                    control={control}
                    render={({ field }) => (
                        <Checkbox id="is-organization" checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                    )}
                />
                <Label htmlFor="is-organization" className="cursor-pointer">
                    Is organization
                </Label>
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
