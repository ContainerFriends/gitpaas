import { ReactNode } from 'react';

import { GitProviderFormData } from '../models/git-provider-form.models';

import { CreateGitProviderForm } from './CreateGitProviderForm';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/components/dialog';

interface CreateGitProviderDialogProps {
    open: boolean;
    isLoading?: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: GitProviderFormData) => void;
}

export function CreateGitProviderDialog({ open, onOpenChange, onSubmit, isLoading = false }: CreateGitProviderDialogProps): ReactNode {
    const handleCancel = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create new git provider</DialogTitle>
                </DialogHeader>
                <CreateGitProviderForm onSubmit={onSubmit} onCancel={handleCancel} isLoading={isLoading} />
            </DialogContent>
        </Dialog>
    );
}
