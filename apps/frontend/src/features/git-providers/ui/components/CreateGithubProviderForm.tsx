import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

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

    // Ejemplo de función en React
    const handleCreateApp = (data: GithubGitProviderFormData) => {
        const traceId = uuidv4();
        const manifest = {
            name: `GitPaaS-${Date.now()}`,
            url: 'https://gitpaas.dev',
            hook_attributes: {
                url: 'https://api-development.gitpaas.dev/webhooks/github',
            },
            redirect_url: `https://api-development.gitpaas.dev/v1/events/github-installation?traceId=${traceId}`,
            setup_url: `https://api-development.gitpaas.dev/v1/events/github-postinstallation?traceId=${traceId}`,
            public: false,
            default_permissions: {
                contents: 'read',
                metadata: 'read',
                pull_requests: 'read',
            },
            default_events: ['push', 'pull_request'],
        };

        // Prepare state data to be sent to GitHub
        const stateData = {
            id: uuidv4(),
            name: data.name,
            ...(data.isOrganization && data.organizationName ? { organization: data.organizationName } : {}),
        };

        const state = btoa(JSON.stringify(stateData));

        // Crear un form dinámico y enviarlo
        const form = document.createElement('form');
        const baseUrl = data.isOrganization
            ? `https://github.com/organizations/${data.organizationName}/settings/apps/new`
            : `https://github.com/settings/apps/new`;

        form.method = 'POST';
        form.action = `${baseUrl}?state=${state}`;

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'manifest';
        input.value = JSON.stringify(manifest);

        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
    };

    return (
        <form onSubmit={handleSubmit(handleCreateApp)} className="space-y-4">
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
