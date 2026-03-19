import { useReducer, useCallback } from 'react';

import { Volume } from '../../domain/models/volume.models';

/**
 * Actions for the volumes reducer.
 */
type VolumesAction =
    | { type: 'SET_VOLUMES'; payload: Volume[] }
    | { type: 'DELETE_VOLUME'; payload: string }
    | { type: 'SET_FILTER'; payload: string }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };

/**
 * The state shape for volumes management.
 */
interface VolumesState {
    volumes: Volume[];
    filter: string;
    loading: boolean;
    error: string | null;
    filteredVolumes: Volume[];
}

/**
 * Initial state for volumes.
 */
const initialState: VolumesState = {
    volumes: [],
    filter: '',
    loading: false,
    error: null,
    filteredVolumes: [],
};

/**
 * Filters volumes based on the search term.
 */
function filterVolumes(volumes: Volume[], filter: string): Volume[] {
    if (!filter.trim()) return volumes;

    const searchTerm = filter.toLowerCase();
    return volumes.filter((volume) => {
        const matchesName = volume.name.toLowerCase().includes(searchTerm);
        const matchesDriver = volume.driver.toLowerCase().includes(searchTerm);
        return matchesName || matchesDriver;
    });
}

/**
 * Volumes reducer function.
 */
function volumesReducer(state: VolumesState, action: VolumesAction): VolumesState {
    switch (action.type) {
        case 'SET_VOLUMES': {
            const filteredVolumes = filterVolumes(action.payload, state.filter);
            return {
                ...state,
                volumes: action.payload,
                filteredVolumes,
                loading: false,
                error: null,
            };
        }

        case 'DELETE_VOLUME': {
            const updatedVolumes = state.volumes.filter((volume) => volume.name !== action.payload);
            const filteredVolumes = filterVolumes(updatedVolumes, state.filter);
            return {
                ...state,
                volumes: updatedVolumes,
                filteredVolumes,
            };
        }

        case 'SET_FILTER': {
            const filteredVolumes = filterVolumes(state.volumes, action.payload);
            return {
                ...state,
                filter: action.payload,
                filteredVolumes,
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
 * Custom hook for managing volumes state.
 */
export function useVolumesState() {
    const [state, dispatch] = useReducer(volumesReducer, initialState);

    const setVolumes = useCallback((volumes: Volume[]) => {
        dispatch({ type: 'SET_VOLUMES', payload: volumes });
    }, []);

    const deleteVolume = useCallback((name: string) => {
        dispatch({ type: 'DELETE_VOLUME', payload: name });
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
        setVolumes,
        deleteVolume,
        setFilter,
        setLoading,
        setError,
    };
}
