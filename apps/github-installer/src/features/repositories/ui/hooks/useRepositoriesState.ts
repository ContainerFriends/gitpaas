import { useReducer, useCallback } from 'react';

import { Branch } from '../../domain/models/branch.models';
import { Repository } from '../../domain/models/repository.models';

type RepositoriesAction =
    | { type: 'SET_REPOSITORIES'; payload: Repository[] }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_BRANCHES'; payload: Branch[] }
    | { type: 'SET_LOADING_BRANCHES'; payload: boolean };

interface RepositoriesState {
    repositories: Repository[];
    loading: boolean;
    error: string | null;
    branches: Branch[];
    loadingBranches: boolean;
}

const initialState: RepositoriesState = {
    repositories: [],
    loading: false,
    error: null,
    branches: [],
    loadingBranches: false,
};

function repositoriesReducer(state: RepositoriesState, action: RepositoriesAction): RepositoriesState {
    switch (action.type) {
        case 'SET_REPOSITORIES':
            return {
                ...state,
                repositories: action.payload,
                loading: false,
                error: null,
            };

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

        case 'SET_BRANCHES':
            return {
                ...state,
                branches: action.payload,
                loadingBranches: false,
            };

        case 'SET_LOADING_BRANCHES':
            return {
                ...state,
                loadingBranches: action.payload,
            };

        default:
            return state;
    }
}

export function useRepositoriesState() {
    const [state, dispatch] = useReducer(repositoriesReducer, initialState);

    const setRepositories = useCallback((repositories: Repository[]) => {
        dispatch({ type: 'SET_REPOSITORIES', payload: repositories });
    }, []);

    const setLoading = useCallback((loading: boolean) => {
        dispatch({ type: 'SET_LOADING', payload: loading });
    }, []);

    const setError = useCallback((error: string | null) => {
        dispatch({ type: 'SET_ERROR', payload: error });
    }, []);

    const setBranches = useCallback((branches: Branch[]) => {
        dispatch({ type: 'SET_BRANCHES', payload: branches });
    }, []);

    const setLoadingBranches = useCallback((loading: boolean) => {
        dispatch({ type: 'SET_LOADING_BRANCHES', payload: loading });
    }, []);

    return {
        state,
        setRepositories,
        setLoading,
        setError,
        setBranches,
        setLoadingBranches,
    };
}
