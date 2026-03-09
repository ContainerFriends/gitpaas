import { useReducer, useCallback } from 'react';

import { Container } from '../../domain/models/container.models';

/**
 * Actions for the containers reducer.
 */
type ContainersAction =
    | { type: 'SET_CONTAINERS'; payload: Container[] }
    | { type: 'SET_FILTER'; payload: string }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };

/**
 * The state shape for containers management.
 */
interface ContainersState {
    containers: Container[];
    filter: string;
    loading: boolean;
    error: string | null;
    filteredContainers: Container[];
}

/**
 * Initial state for containers.
 */
const initialState: ContainersState = {
    containers: [],
    filter: '',
    loading: false,
    error: null,
    filteredContainers: [],
};

/**
 * Filters containers based on the search term.
 */
function filterContainers(containers: Container[], filter: string): Container[] {
    if (!filter.trim()) return containers;

    const searchTerm = filter.toLowerCase();
    return containers.filter((container) => {
        const matchesName = container.names.some((name) => name.toLowerCase().includes(searchTerm));
        const matchesImage = container.image.toLowerCase().includes(searchTerm);
        const matchesId = container.id.toLowerCase().includes(searchTerm);
        return matchesName || matchesImage || matchesId;
    });
}

/**
 * Containers reducer function.
 */
function containersReducer(state: ContainersState, action: ContainersAction): ContainersState {
    switch (action.type) {
        case 'SET_CONTAINERS': {
            const filteredContainers = filterContainers(action.payload, state.filter);
            return {
                ...state,
                containers: action.payload,
                filteredContainers,
                loading: false,
                error: null,
            };
        }

        case 'SET_FILTER': {
            const filteredContainers = filterContainers(state.containers, action.payload);
            return {
                ...state,
                filter: action.payload,
                filteredContainers,
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

/**
 * Custom hook for managing containers state.
 */
export function useContainersState() {
    const [state, dispatch] = useReducer(containersReducer, initialState);

    const setContainers = useCallback((containers: Container[]) => {
        dispatch({ type: 'SET_CONTAINERS', payload: containers });
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
        setContainers,
        setFilter,
        setLoading,
        setError,
    };
}
