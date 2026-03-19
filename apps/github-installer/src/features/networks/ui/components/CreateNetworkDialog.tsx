import { ReactNode } from 'react';

import { NetworkFormData } from '../models/network-form.models';

import { CreateNetworkForm } from './CreateNetworkForm';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/components/dialog';

interface CreateNetworkDialogProps {
    open: boolean;
    isLoading?: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: NetworkFormData) => void;
}

/**
 * Create network dialog component
 */
export function CreateNetworkDialog({ open, onOpenChange, onSubmit, isLoading = false }: CreateNetworkDialogProps): ReactNode {
    /**
     * Handle cancel create network dialog
     */
    const handleCancel = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create new network</DialogTitle>
                </DialogHeader>
                <CreateNetworkForm onSubmit={onSubmit} onCancel={handleCancel} isLoading={isLoading} />
            </DialogContent>
        </Dialog>
    );
}