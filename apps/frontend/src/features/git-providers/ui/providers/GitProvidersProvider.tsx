import { ReactNode, useCallback } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import { getGitProviderByIdUseCase } from '../../application/get-git-provider-by-id.use-case';
import { getGitProvidersUseCase } from '../../application/get-git-providers.use-case';
import { removeGitProviderUseCase } from '../../application/remove-git-provider.use-case';
import { updateGitProviderUseCase } from '../../application/update-git-provider.use-case';
import { GitProvider, GitProviderType } from '../../domain/models/git-provider.models';
import { gitProvidersApiRepository } from '../../infrastructure/api/git-providers-api.repository';
import { GitProvidersContext, GitProvidersContextValue } from '../context/GitProvidersContext';
import { useGitProvidersState } from '../hooks/useGitProvidersState';
import { GitProviderFormData } from '../models/git-provider-form.models';

interface GitProvidersProviderProps {
    children: ReactNode;
}

export function GitProvidersProvider({ children }: GitProvidersProviderProps): ReactNode {
    const {
        state,
        setGitProviders,
        updateGitProvider: updateGitProviderState,
        deleteGitProvider,
        setSelectedGitProvider,
        setLoadingGitProvider,
        setSubmittingGitProvider,
        setFilter,
        setLoading,
        setError,
    } = useGitProvidersState();

    const getMockToken = useCallback(async (): Promise<string> => {
        return Promise.resolve('mock-token-for-development');
    }, []);

    const loadGitProviders = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const token = await getMockToken();
            const gitProviders = await getGitProvidersUseCase(gitProvidersApiRepository(token));
            setGitProviders(gitProviders);
        } catch (error) {
            setError('Failed to load git providers');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [getMockToken, setLoading, setError, setGitProviders]);

    const getGitProviderById = useCallback(
        async (id: string): Promise<GitProvider | null> => {
            try {
                setLoadingGitProvider(true);
                setError(null);
                const token = await getMockToken();
                const gitProvider = await getGitProviderByIdUseCase(gitProvidersApiRepository(token), id);
                setSelectedGitProvider(gitProvider);
                return gitProvider;
            } catch (error) {
                setError('Failed to load git provider');
                throw error;
            } finally {
                setLoadingGitProvider(false);
            }
        },
        [getMockToken, setLoadingGitProvider, setError, setSelectedGitProvider],
    );

    const createGitProvider = useCallback((data: GitProviderFormData): void => {
        const traceId = uuidv4();
        const manifest = {
            name: `GitPaaS-${Date.now()}`,
            url: 'https://gitpaas.dev',
            hook_attributes: {
                url: 'https://api-development.gitpaas.dev/webhooks/github',
            },
            redirect_url: `https://api-development.gitpaas.dev/v1/events/github-installation?traceId=${traceId}`,
            setup_url: `https://api-development.gitpaas.dev/v1/events/github-postinstallation?traceId=${traceId}`,
            public: false,
            default_permissions: {
                contents: 'read',
                metadata: 'read',
                pull_requests: 'read',
            },
            default_events: ['push', 'pull_request'],
        };

        // Prepare state data to be sent to GitHub
        const stateData = {
            id: uuidv4(),
            name: data.name,
            ...(data.isOrganization && data.organizationName ? { organization: data.organizationName } : {}),
        };

        const parsedState = btoa(JSON.stringify(stateData));

        // Crear un form dinámico y enviarlo
        const form = document.createElement('form');
        const baseUrl = data.isOrganization
            ? `https://github.com/organizations/${data.organizationName}/settings/apps/new`
            : `https://github.com/settings/apps/new`;

        form.method = 'POST';
        form.action = `${baseUrl}?state=${parsedState}`;

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'manifest';
        input.value = JSON.stringify(manifest);

        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
    }, []);

    const updateGitProvider = useCallback(
        async (data: { id: string; name?: string; type?: string }): Promise<GitProvider | null> => {
            try {
                setSubmittingGitProvider(true);
                setError(null);
                const token = await getMockToken();
                const updated = await updateGitProviderUseCase(gitProvidersApiRepository(token), {
                    id: data.id,
                    name: data.name,
                    type: data.type as GitProviderType | undefined,
                });
                if (updated) {
                    updateGitProviderState(updated);
                    toast.success('Git provider updated successfully');
                }
                return updated;
            } catch (error) {
                setError('Failed to update git provider');
                toast.error('Failed to update git provider');
                throw error;
            } finally {
                setSubmittingGitProvider(false);
            }
        },
        [getMockToken, setSubmittingGitProvider, setError, updateGitProviderState],
    );

    const removeGitProviderHandler = useCallback(
        async (id: string): Promise<void> => {
            try {
                setSubmittingGitProvider(true);
                setError(null);
                const token = await getMockToken();
                await removeGitProviderUseCase(gitProvidersApiRepository(token), id);
                deleteGitProvider(id);
            } catch (error) {
                setError('Failed to remove git provider');
                throw error;
            } finally {
                setSubmittingGitProvider(false);
            }
        },
        [getMockToken, setSubmittingGitProvider, setError, deleteGitProvider],
    );

    const setFilterHandler = useCallback(
        (filter: string): void => {
            setFilter(filter);
        },
        [setFilter],
    );

    const contextValue: GitProvidersContextValue = {
        gitProviders: state.gitProviders,
        filter: state.filter,
        loading: state.loading,
        error: state.error,
        filteredGitProviders: state.filteredGitProviders,
        selectedGitProvider: state.selectedGitProvider,
        loadingGitProvider: state.loadingGitProvider,
        submittingGitProvider: state.submittingGitProvider,
        loadGitProviders,
        getGitProviderById,
        createGitProvider,
        updateGitProvider,
        removeGitProvider: removeGitProviderHandler,
        setFilter: setFilterHandler,
    };

    return <GitProvidersContext.Provider value={contextValue}>{children}</GitProvidersContext.Provider>;
}
