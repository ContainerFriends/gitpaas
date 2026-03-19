import { Save } from 'lucide-react';
import { ReactNode, useEffect, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { ServiceDetailFormData } from '../models/service-form.models';

import { GitProvider } from '@features/git-providers/domain/models/git-provider.models';
import { useRepositories } from '@features/repositories/ui/hooks/useRepositories';
import { Button } from '@shared/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/card';
import { Label } from '@shared/components/label';
import { Select } from '@shared/components/select';
import { Select2, SelectOption } from '@shared/components/select2';

interface ServiceProviderCardProps {
    gitProviders: GitProvider[];
    selectedGitProviderId: string | undefined;
    selectedRepositoryId: string | undefined;
    isSaving: boolean;
    onSubmit: (data: ServiceDetailFormData) => Promise<void>;
}

/**
 * Service provider component.
 */
export function ServiceProvider({
    gitProviders,
    selectedGitProviderId,
    selectedRepositoryId,
    isSaving,
    onSubmit,
}: ServiceProviderCardProps): ReactNode {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, dirtyFields },
    } = useFormContext<ServiceDetailFormData>();
    // eslint-disable-next-line object-curly-newline
    const { repositories, loading: repositoriesLoading, loadRepositories, branches, loadingBranches, loadBranches } = useRepositories();

    const isProviderDirty = Boolean(dirtyFields.gitProviderId || dirtyFields.repositoryId || dirtyFields.branch);

    const repositoryOptions: SelectOption[] = useMemo(
        () => repositories.map((repo) => ({ value: String(repo.id), label: repo.name })),
        [repositories],
    );

    const branchOptions: SelectOption[] = useMemo(() => branches.map((branch) => ({ value: branch.name, label: branch.name })), [branches]);

    useEffect(() => {
        if (selectedGitProviderId) {
            loadRepositories(selectedGitProviderId);
        }
    }, [selectedGitProviderId, loadRepositories]);

    useEffect(() => {
        if (selectedGitProviderId && selectedRepositoryId) {
            loadBranches(selectedGitProviderId, selectedRepositoryId);
        }
    }, [selectedGitProviderId, selectedRepositoryId, loadBranches]);

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
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="repositoryId">Repository</Label>
                                            <Controller
                                                name="repositoryId"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select2
                                                        inputId="repositoryId"
                                                        options={repositoryOptions}
                                                        value={repositoryOptions.find((o) => o.value === field.value) ?? null}
                                                        onChange={(option) => {
                                                            field.onChange(option?.value ?? '');
                                                        }}
                                                        onBlur={field.onBlur}
                                                        placeholder="Select a repository"
                                                        loading={repositoriesLoading}
                                                    />
                                                )}
                                            />
                                            {errors.repositoryId && <p className="text-sm text-destructive">{errors.repositoryId.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="branch">Branch</Label>
                                            <Controller
                                                name="branch"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select2
                                                        inputId="branch"
                                                        options={branchOptions}
                                                        value={branchOptions.find((o) => o.value === field.value) ?? null}
                                                        onChange={(option) => {
                                                            field.onChange(option?.value ?? '');
                                                        }}
                                                        onBlur={field.onBlur}
                                                        placeholder="Select a branch"
                                                        loading={loadingBranches}
                                                        disabled={!selectedRepositoryId}
                                                    />
                                                )}
                                            />
                                            {errors.branch && <p className="text-sm text-destructive">{errors.branch.message}</p>}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-6 border-t">
                            <Button type="submit" disabled={!isProviderDirty || isSaving}>
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
