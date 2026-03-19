import { useReducer, useCallback } from 'react';

import { Network } from '../../domain/models/network.models';

/**
 * Actions for the networks reducer.
 */
type NetworksAction =
    | { type: 'LOAD_NETWORKS_REQUEST' }
    | { type: 'SET_NETWORKS'; payload: Network[] }
    | { type: 'ADD_NETWORK'; payload: Network }
    | { type: 'DELETE_NETWORK'; payload: string }
    | { type: 'SET_SELECTED_NETWORK'; payload: Network | null }
    | { type: 'SET_LOADING_NETWORK'; payload: boolean }
    | { type: 'SET_SUBMITTING_NETWORK'; payload: boolean }
    | { type: 'SET_FILTER'; payload: string }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };

/**
 * The state shape for networks management.
 */
interface NetworksState {
    networks: Network[];
    filter: string;
    loading: boolean;
    error: string | null;
    filteredNetworks: Network[];
    selectedNetwork: Network | null;
    loadingNetwork: boolean;
    submittingNetwork: boolean;
}

/**
 * Initial state for networks.
 */
const initialState: NetworksState = {
    networks: [],
    filter: '',
    loading: false,
    error: null,
    filteredNetworks: [],
    selectedNetwork: null,
    loadingNetwork: false,
    submittingNetwork: false,
};

/**
 * Filters networks based on the search term.
 */
function filterNetworks(networks: Network[], filter: string): Network[] {
    if (!filter.trim()) return networks;

    const searchTerm = filter.toLowerCase();
    return networks.filter((network) => network.name.toLowerCase().includes(searchTerm));
}

/**
 * Networks reducer function.
 */
function networksReducer(state: NetworksState, action: NetworksAction): NetworksState {
    switch (action.type) {
        case 'LOAD_NETWORKS_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };

        case 'SET_NETWORKS': {
            const filteredNetworks = filterNetworks(action.payload, state.filter);
            return {
                ...state,
                networks: action.payload,
                filteredNetworks,
                loading: false,
                error: null,
            };
        }

        case 'ADD_NETWORK': {
            const newNetworks = [...state.networks, action.payload];
            const filteredNetworks = filterNetworks(newNetworks, state.filter);
            return {
                ...state,
                networks: newNetworks,
                filteredNetworks,
            };
        }

        case 'DELETE_NETWORK': {
            const updatedNetworks = state.networks.filter((network) => network.id !== action.payload);
            const filteredNetworks = filterNetworks(updatedNetworks, state.filter);
            return {
                ...state,
                networks: updatedNetworks,
                filteredNetworks,
                selectedNetwork: state.selectedNetwork?.id === action.payload ? null : state.selectedNetwork,
            };
        }

        case 'SET_SELECTED_NETWORK':
            return {
                ...state,
                selectedNetwork: action.payload,
            };

        case 'SET_LOADING_NETWORK':
            return {
                ...state,
                loadingNetwork: action.payload,
            };

        case 'SET_SUBMITTING_NETWORK':
            return {
                ...state,
                submittingNetwork: action.payload,
            };

        case 'SET_FILTER': {
            const filteredNetworks = filterNetworks(state.networks, action.payload);
            return {
                ...state,
                filter: action.payload,
                filteredNetworks,
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
 * Custom hook for managing networks state.
 */
export function useNetworksState() {
    const [state, dispatch] = useReducer(networksReducer, initialState);

    const setNetworks = useCallback((networks: Network[]) => {
        dispatch({ type: 'SET_NETWORKS', payload: networks });
    }, []);

    const addNetwork = useCallback((network: Network) => {
        dispatch({ type: 'ADD_NETWORK', payload: network });
    }, []);

    const deleteNetwork = useCallback((id: string) => {
        dispatch({ type: 'DELETE_NETWORK', payload: id });
    }, []);

    const setSelectedNetwork = useCallback((network: Network | null) => {
        dispatch({ type: 'SET_SELECTED_NETWORK', payload: network });
    }, []);

    const setLoadingNetwork = useCallback((loading: boolean) => {
        dispatch({ type: 'SET_LOADING_NETWORK', payload: loading });
    }, []);

    const setSubmittingNetwork = useCallback((submitting: boolean) => {
        dispatch({ type: 'SET_SUBMITTING_NETWORK', payload: submitting });
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
        setNetworks,
        addNetwork,
        deleteNetwork,
        setSelectedNetwork,
        setLoadingNetwork,
        setSubmittingNetwork,
        setFilter,
        setLoading,
        setError,
    };
}