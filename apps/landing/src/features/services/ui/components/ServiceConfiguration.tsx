import { Save } from 'lucide-react';
import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

import { ServiceDetailFormData } from '../models/service-form.models';

import { Button } from '@shared/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/card';
import { Input } from '@shared/components/input';
import { Label } from '@shared/components/label';

interface ServiceConfigurationProps {
    isSaving: boolean;
    onSubmit: (data: ServiceDetailFormData) => Promise<void>;
}

/**
 * Service configuration component.
 */
export function ServiceConfiguration({ isSaving, onSubmit }: ServiceConfigurationProps): ReactNode {
    const {
        register,
        handleSubmit,
        formState: { errors, dirtyFields },
    } = useFormContext<ServiceDetailFormData>();

    const isConfigDirty = Boolean(dirtyFields.composePath);

    return (
        <Card className="cursor-default hover:border-border">
            <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>Docker Compose settings</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="max-w-2xl">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="composePath">Compose path</Label>
                            <Input id="composePath" placeholder="docker-compose.yml" {...register('composePath')} />
                            {errors.composePath && <p className="text-sm text-destructive">{errors.composePath.message}</p>}
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-6 border-t">
                            <Button type="submit" disabled={!isConfigDirty || isSaving}>
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
