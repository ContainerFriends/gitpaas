import { useReducer, useCallback } from 'react';

import { GitProvider } from '../../domain/models/git-provider.models';

type GitProvidersAction =
    | { type: 'LOAD_GIT_PROVIDERS_REQUEST' }
    | { type: 'SET_GIT_PROVIDERS'; payload: GitProvider[] }
    | { type: 'ADD_GIT_PROVIDER'; payload: GitProvider }
    | { type: 'UPDATE_GIT_PROVIDER'; payload: GitProvider }
    | { type: 'DELETE_GIT_PROVIDER'; payload: string }
    | { type: 'SET_SELECTED_GIT_PROVIDER'; payload: GitProvider | null }
    | { type: 'SET_LOADING_GIT_PROVIDER'; payload: boolean }
    | { type: 'SET_SUBMITTING_GIT_PROVIDER'; payload: boolean }
    | { type: 'SET_FILTER'; payload: string }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };

interface GitProvidersState {
    gitProviders: GitProvider[];
    filter: string;
    loading: boolean;
    error: string | null;
    filteredGitProviders: GitProvider[];
    selectedGitProvider: GitProvider | null;
    loadingGitProvider: boolean;
    submittingGitProvider: boolean;
}

const initialState: GitProvidersState = {
    gitProviders: [],
    filter: '',
    loading: false,
    error: null,
    filteredGitProviders: [],
    selectedGitProvider: null,
    loadingGitProvider: false,
    submittingGitProvider: false,
};

function filterGitProviders(gitProviders: GitProvider[], filter: string): GitProvider[] {
    if (!filter.trim()) return gitProviders;
    const searchTerm = filter.toLowerCase();
    return gitProviders.filter((gp) => gp.name.toLowerCase().includes(searchTerm));
}

function gitProvidersReducer(state: GitProvidersState, action: GitProvidersAction): GitProvidersState {
    switch (action.type) {
        case 'LOAD_GIT_PROVIDERS_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };

        case 'SET_GIT_PROVIDERS': {
            const filteredGitProviders = filterGitProviders(action.payload, state.filter);
            return {
                ...state,
                gitProviders: action.payload,
                filteredGitProviders,
                loading: false,
                error: null,
            };
        }

        case 'ADD_GIT_PROVIDER': {
            const newGitProviders = [...state.gitProviders, action.payload];
            const filteredGitProviders = filterGitProviders(newGitProviders, state.filter);
            return {
                ...state,
                gitProviders: newGitProviders,
                filteredGitProviders,
            };
        }

        case 'UPDATE_GIT_PROVIDER': {
            const updatedGitProviders = state.gitProviders.map((gp) => (gp.id === action.payload.id ? action.payload : gp));
            const filteredGitProviders = filterGitProviders(updatedGitProviders, state.filter);
            return {
                ...state,
                gitProviders: updatedGitProviders,
                filteredGitProviders,
                selectedGitProvider: state.selectedGitProvider?.id === action.payload.id ? action.payload : state.selectedGitProvider,
            };
        }

        case 'DELETE_GIT_PROVIDER': {
            const updatedGitProviders = state.gitProviders.filter((gp) => gp.id !== action.payload);
            const filteredGitProviders = filterGitProviders(updatedGitProviders, state.filter);
            return {
                ...state,
                gitProviders: updatedGitProviders,
                filteredGitProviders,
                selectedGitProvider: state.selectedGitProvider?.id === action.payload ? null : state.selectedGitProvider,
            };
        }

        case 'SET_SELECTED_GIT_PROVIDER':
            return {
                ...state,
                selectedGitProvider: action.payload,
            };

        case 'SET_LOADING_GIT_PROVIDER':
            return {
                ...state,
                loadingGitProvider: action.payload,
            };

        case 'SET_SUBMITTING_GIT_PROVIDER':
            return {
                ...state,
                submittingGitProvider: action.payload,
            };

        case 'SET_FILTER': {
            const filteredGitProviders = filterGitProviders(state.gitProviders, action.payload);
            return {
                ...state,
                filter: action.payload,
                filteredGitProviders,
            };
        }

        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload,
            };

        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
            };

        default:
            return state;
    }
}

export function useGitProvidersState() {
    const [state, dispatch] = useReducer(gitProvidersReducer, initialState);

    const setGitProviders = useCallback((gitProviders: GitProvider[]) => {
        dispatch({ type: 'SET_GIT_PROVIDERS', payload: gitProviders });
    }, []);

    const addGitProvider = useCallback((gitProvider: GitProvider) => {
        dispatch({ type: 'ADD_GIT_PROVIDER', payload: gitProvider });
    }, []);

    const updateGitProvider = useCallback((gitProvider: GitProvider) => {
        dispatch({ type: 'UPDATE_GIT_PROVIDER', payload: gitProvider });
    }, []);

    const deleteGitProvider = useCallback((id: string) => {
        dispatch({ type: 'DELETE_GIT_PROVIDER', payload: id });
    }, []);

    const setSelectedGitProvider = useCallback((gitProvider: GitProvider | null) => {
        dispatch({ type: 'SET_SELECTED_GIT_PROVIDER', payload: gitProvider });
    }, []);

    const setLoadingGitProvider = useCallback((loading: boolean) => {
        dispatch({ type: 'SET_LOADING_GIT_PROVIDER', payload: loading });
    }, []);

    const setSubmittingGitProvider = useCallback((submitting: boolean) => {
        dispatch({ type: 'SET_SUBMITTING_GIT_PROVIDER', payload: submitting });
    }, []);

    const setFilter = useCallback((filter: string) => {
        dispatch({ type: 'SET_FILTER', payload: filter });
    }, []);

    const setLoading = useCallback((loading: boolean) => {
        dispatch({ type: 'SET_LOADING', payload: loading });
    }, []);

    const setError = useCallback((error: string | null) => {
        dispatch({ type: 'SET_ERROR', payload: error });
    }, []);

    return {
        state,
        setGitProviders,
        addGitProvider,
        updateGitProvider,
        deleteGitProvider,
        setSelectedGitProvider,
        setLoadingGitProvider,
        setSubmittingGitProvider,
        setFilter,
        setLoading,
        setError,
    };
}
