import { ReactNode } from 'react';

import { ServiceFormData } from '../models/service-form.models';

import { CreateServiceForm } from './CreateServiceForm';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/components/dialog';

interface CreateServiceDialogProps {
    open: boolean;
    isLoading?: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: ServiceFormData) => void;
}

/**
 * Create service dialog component
 */
export function CreateServiceDialog({ open, onOpenChange, onSubmit, isLoading = false }: CreateServiceDialogProps): ReactNode {
    const handleCancel = (): void => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create new service</DialogTitle>
                </DialogHeader>
                <CreateServiceForm onSubmit={onSubmit} onCancel={handleCancel} isLoading={isLoading} />
            </DialogContent>
        </Dialog>
    );
}
