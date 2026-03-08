import { ReactNode } from 'react';

import { ServiceFormData } from '../models/service-form.models';

import { EditServiceForm } from './EditServiceForm';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/components/dialog';

interface EditServiceDialogProps {
    open: boolean;
    initialData: ServiceFormData;
    isLoading?: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: ServiceFormData) => void;
}

/**
 * Edit service dialog component
 */
// eslint-disable-next-line object-curly-newline
export function EditServiceDialog({ open, onOpenChange, onSubmit, initialData, isLoading = false }: EditServiceDialogProps): ReactNode {
    const handleCancel = (): void => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit service</DialogTitle>
                </DialogHeader>
                <EditServiceForm initialData={initialData} onSubmit={onSubmit} isLoading={isLoading} onCancel={handleCancel} />
            </DialogContent>
        </Dialog>
    );
}
