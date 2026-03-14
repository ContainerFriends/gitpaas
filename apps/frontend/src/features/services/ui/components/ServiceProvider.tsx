import { GitBranch, LinkIcon, Save } from 'lucide-react';
import { ReactNode } from 'react';
import { UseFormHandleSubmit, UseFormRegister, FieldErrors } from 'react-hook-form';

import { ServiceDetailFormData } from '../models/service-form.models';

import { GitProvider } from '@features/git-providers/domain/models/git-provider.models';
import { Button } from '@shared/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/card';
import { Input } from '@shared/components/input';
import { Label } from '@shared/components/label';
import { Select } from '@shared/components/select';

interface ServiceProviderCardProps {
    gitProviders: GitProvider[];
    selectedGitProviderId: string | undefined;
    errors: FieldErrors<ServiceDetailFormData>;
    isDirty: boolean;
    isSaving: boolean;
    register: UseFormRegister<ServiceDetailFormData>;
    handleSubmit: UseFormHandleSubmit<ServiceDetailFormData>;
    onSubmit: (data: ServiceDetailFormData) => Promise<void>;
}

/**
 * Service provider component.
 */
export function ServiceProvider({
    gitProviders,
    selectedGitProviderId,
    errors,
    isDirty,
    isSaving,
    register,
    handleSubmit,
    onSubmit,
}: ServiceProviderCardProps): ReactNode {
    return (
        <Card className="cursor-default hover:border-border">
            <CardHeader>
                <CardTitle>Provider</CardTitle>
                <CardDescription>Select the source of your code</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="max-w-2xl">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-6">
                            <div className="space-y-2">
                                <Select id="gitProviderId" {...register('gitProviderId')}>
                                    <option value="">Select a git provider</option>
                                    {gitProviders.map((provider) => (
                                        <option key={provider.id} value={provider.id}>
                                            {provider.name}
                                        </option>
                                    ))}
                                </Select>
                                {errors.gitProviderId && <p className="text-sm text-destructive">{errors.gitProviderId.message}</p>}
                            </div>

                            {selectedGitProviderId && (
                                <>
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
                                </>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-6 border-t">
                            <Button type="submit" disabled={!isDirty || isSaving}>
                                <Save />
                                {isSaving ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}
