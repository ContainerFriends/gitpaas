import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/components/dialog';
import { ReactNode } from 'react';

import { ServiceFormSchema } from '../schemas/service.schemas';
import { ServiceForm } from './ServiceForm';

interface CreateServiceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: ServiceFormSchema) => void;
    isSubmitting?: boolean;
}

/**
 * Create Service Dialog component
 */
export function CreateServiceDialog({ 
    open, 
    onOpenChange, 
    onSubmit, 
    isSubmitting = false 
}: CreateServiceDialogProps): ReactNode {
    const handleCancel = (): void => {
        onOpenChange(false);
    };

    const handleSubmit = (data: ServiceFormSchema): void => {
        onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Service</DialogTitle>
                </DialogHeader>
                <ServiceForm 
                    onSubmit={handleSubmit} 
                    isSubmitting={isSubmitting} 
                    onCancel={handleCancel}
                />
            </DialogContent>
        </Dialog>
    );
}