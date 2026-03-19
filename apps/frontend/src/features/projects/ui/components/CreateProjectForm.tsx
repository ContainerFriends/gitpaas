import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';

import { ProjectFormData } from '../models/project-form.models';
import { projectFormSchema } from '../schemas/project-form.schema';

import { Button } from '@shared/components/button';
import { Input } from '@shared/components/input';
import { Label } from '@shared/components/label';

interface ProjectFormProps {
    onSubmit: (data: ProjectFormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

/**
 * Project creation form component
 */
export function CreateProjectForm({ onSubmit, onCancel, isLoading = false }: ProjectFormProps): ReactNode {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectFormSchema),
        mode: 'onChange',
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="project-name">Name</Label>
                <Input id="project-name" placeholder="Enter project name..." disabled={isLoading} {...register('name')} />
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
