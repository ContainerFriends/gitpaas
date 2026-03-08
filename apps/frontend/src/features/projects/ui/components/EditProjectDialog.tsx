import { ReactNode } from 'react';

import { ProjectFormData } from '../models/project-form.models';

import { EditProjectForm } from './EditProjectForm';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/components/dialog';

interface EditProjectDialogProps {
    open: boolean;
    initialData: ProjectFormData;
    isLoading?: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: ProjectFormData) => void;
}

/**
 * Edit project dialog component
 */
// eslint-disable-next-line object-curly-newline
export function EditProjectDialog({ open, onOpenChange, onSubmit, initialData, isLoading = false }: EditProjectDialogProps): ReactNode {
    const handleCancel = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit project</DialogTitle>
                </DialogHeader>
                <EditProjectForm initialData={initialData} onSubmit={onSubmit} onCancel={handleCancel} isLoading={isLoading} />
            </DialogContent>
        </Dialog>
    );
}
