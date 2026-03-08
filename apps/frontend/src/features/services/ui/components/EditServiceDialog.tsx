import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/components/dialog';
import { ReactNode } from 'react';

import { Service } from '../../domain/models/service.models';
import { ServiceFormSchema } from '../schemas/service.schemas';
import { ServiceForm } from './ServiceForm';

interface EditServiceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    service: Service | null;
    onSubmit: (data: ServiceFormSchema) => void;
    isSubmitting?: boolean;
}

/**
 * Edit Service Dialog component
 */
export function EditServiceDialog({ 
    open, 
    onOpenChange, 
    service, 
    onSubmit, 
    isSubmitting = false 
}: EditServiceDialogProps): ReactNode {
    const handleCancel = (): void => {
        onOpenChange(false);
    };

    const handleSubmit = (data: ServiceFormSchema): void => {
        onSubmit(data);
    };

    if (!service) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Service</DialogTitle>
                </DialogHeader>
                <ServiceForm 
                    service={service}
                    onSubmit={handleSubmit} 
                    isSubmitting={isSubmitting} 
                    onCancel={handleCancel}
                />
            </DialogContent>
        </Dialog>
    );
}