import { ReactNode } from 'react';

import { GitProviderType } from '../../domain/models/git-provider.models';
import { GithubGitProviderFormData, GitProviderFormData } from '../models/git-provider-form.models';

import { CreateGithubProviderForm } from './CreateGithubProviderForm';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/components/dialog';

const PROVIDER_LABELS: Record<GitProviderType, string> = {
    github: 'GitHub',
};

interface CreateGitProviderDialogProps {
    open: boolean;
    providerType: GitProviderType;
    isLoading?: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: GitProviderFormData) => void;
}

/**
 * Create Git provider dialog component
 */
// eslint-disable-next-line object-curly-newline
export function CreateGitProviderDialog({ open, providerType, onOpenChange, onSubmit, isLoading = false }: CreateGitProviderDialogProps): ReactNode {
    const handleCancel = () => {
        onOpenChange(false);
    };

    const handleSubmit = (data: GithubGitProviderFormData) => {
        const providerData = { ...data, type: 'github' };

        onSubmit(providerData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create {PROVIDER_LABELS[providerType]} provider</DialogTitle>
                </DialogHeader>
                {providerType === 'github' && <CreateGithubProviderForm onSubmit={handleSubmit} onCancel={handleCancel} isLoading={isLoading} />}
            </DialogContent>
        </Dialog>
    );
}
