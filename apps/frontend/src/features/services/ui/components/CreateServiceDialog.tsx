import { Layers } from 'lucide-react';
import { ReactNode, useState } from 'react';

import { ServiceType } from '../../domain/models/service.models';
import { ServiceFormData } from '../models/service-form.models';

import { CreateServiceForm } from './CreateServiceForm';

import { Card, CardDescription, CardHeader, CardTitle } from '@shared/components/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/components/dialog';

interface CreateServiceDialogProps {
    open: boolean;
    isLoading?: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: ServiceFormData) => void;
}

const SERVICE_TYPES: Array<{ value: ServiceType; label: string; description: string }> = [
    { value: 'docker_compose', label: 'Docker Compose', description: 'Deploy using a docker-compose.yml file' },
];

/**
 * Create service dialog component
 */
export function CreateServiceDialog({ open, onOpenChange, onSubmit, isLoading = false }: CreateServiceDialogProps): ReactNode {
    const [selectedType, setSelectedType] = useState<ServiceType | null>(null);

    const handleCancel = (): void => {
        setSelectedType(null);
        onOpenChange(false);
    };

    const handleBack = (): void => {
        setSelectedType(null);
    };

    const handleSubmit = (data: ServiceFormData): void => {
        onSubmit(data);
        setSelectedType(null);
    };

    const handleOpenChange = (isOpen: boolean): void => {
        if (!isOpen) {
            setSelectedType(null);
        }
        onOpenChange(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                {!selectedType ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Select service type</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-3 pt-2">
                            {SERVICE_TYPES.map((serviceType) => (
                                <Card
                                    key={serviceType.value}
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setSelectedType(serviceType.value);
                                    }}
                                >
                                    <CardHeader className="flex flex-row items-center gap-3 pb-0">
                                        <div className="rounded-md bg-muted p-2">
                                            <Layers className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">{serviceType.label}</CardTitle>
                                            <CardDescription>{serviceType.description}</CardDescription>
                                        </div>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Create new service</DialogTitle>
                        </DialogHeader>
                        <CreateServiceForm
                            type={selectedType}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            onBack={handleBack}
                            isLoading={isLoading}
                        />
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
