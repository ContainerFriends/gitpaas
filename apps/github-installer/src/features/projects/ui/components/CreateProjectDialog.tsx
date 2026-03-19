import { ReactNode } from 'react';

import { ProjectFormData } from '../models/project-form.models';

import { CreateProjectForm } from './CreateProjectForm';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/components/dialog';

interface CreateProjectDialogProps {
    open: boolean;
    isLoading?: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: ProjectFormData) => void;
}

/**
 * Create project dialog component
 */
export function CreateProjectDialog({ open, onOpenChange, onSubmit, isLoading = false }: CreateProjectDialogProps): ReactNode {
    /**
     * Handle cancel create project dialog
     */
    const handleCancel = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create new project</DialogTitle>
                </DialogHeader>
                <CreateProjectForm onSubmit={onSubmit} onCancel={handleCancel} isLoading={isLoading} />
            </DialogContent>
        </Dialog>
    );
}
