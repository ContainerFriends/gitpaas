import { useReducer, useCallback } from 'react';

import { Service } from '../../domain/models/service.models';

/**
 * Actions for the services reducer.
 */
type ServicesAction =
    | { type: 'LOAD_SERVICES_REQUEST' }
    | { type: 'SET_SERVICES'; payload: Service[] }
    | { type: 'ADD_SERVICE'; payload: Service }
    | { type: 'UPDATE_SERVICE'; payload: Service }
    | { type: 'DELETE_SERVICE'; payload: string }
    | { type: 'SET_SELECTED_SERVICE'; payload: Service | null }
    | { type: 'SET_LOADING_SERVICE'; payload: boolean }
    | { type: 'SET_SUBMITTING_SERVICE'; payload: boolean }
    | { type: 'SET_FILTER'; payload: string }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_PROJECT_ID'; payload: string | null };

/**
 * The state shape for services management.
 */
interface ServicesState {
    services: Service[];
    filter: string;
    loading: boolean;
    error: string | null;
    filteredServices: Service[];
    selectedService: Service | null;
    loadingService: boolean;
    submittingService: boolean;
    projectId: string | null;
}

/**
 * Initial state for services.
 */
const initialState: ServicesState = {
    services: [],
    filter: '',
    loading: false,
    error: null,
    filteredServices: [],
    selectedService: null,
    loadingService: false,
    submittingService: false,
    projectId: null,
};

/**
 * Filters services based on the search term.
 */
function filterServices(services: Service[], filter: string): Service[] {
    if (!filter.trim()) return services;

    const searchTerm = filter.toLowerCase();
    return services.filter((service) => service.name.toLowerCase().includes(searchTerm));
}

/**
 * Services reducer function.
 */
function servicesReducer(state: ServicesState, action: ServicesAction): ServicesState {
    switch (action.type) {
        case 'LOAD_SERVICES_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };

        case 'SET_SERVICES': {
            const filteredServices = filterServices(action.payload, state.filter);
            return {
                ...state,
                services: action.payload,
                filteredServices,
                loading: false,
                error: null,
            };
        }

        case 'ADD_SERVICE': {
            const newServices = [...state.services, action.payload];
            const filteredServices = filterServices(newServices, state.filter);
            return {
                ...state,
                services: newServices,
                filteredServices,
            };
        }

        case 'UPDATE_SERVICE': {
            const updatedServices = state.services.map((service) => 
                service.id === action.payload.id ? action.payload : service
            );
            const filteredServices = filterServices(updatedServices, state.filter);
            return {
                ...state,
                services: updatedServices,
                filteredServices,
                selectedService: state.selectedService?.id === action.payload.id ? action.payload : state.selectedService,
            };
        }

        case 'DELETE_SERVICE': {
            const updatedServices = state.services.filter((service) => service.id !== action.payload);
            const filteredServices = filterServices(updatedServices, state.filter);
            return {
                ...state,
                services: updatedServices,
                filteredServices,
                selectedService: state.selectedService?.id === action.payload ? null : state.selectedService,
            };
        }

        case 'SET_SELECTED_SERVICE':
            return {
                ...state,
                selectedService: action.payload,
            };

        case 'SET_LOADING_SERVICE':
            return {
                ...state,
                loadingService: action.payload,
            };

        case 'SET_SUBMITTING_SERVICE':
            return {
                ...state,
                submittingService: action.payload,
            };

        case 'SET_FILTER': {
            const filteredServices = filterServices(state.services, action.payload);
            return {
                ...state,
                filter: action.payload,
                filteredServices,
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

        case 'SET_PROJECT_ID':
            return {
                ...state,
                projectId: action.payload,
            };

        default:
            return state;
    }
}

/**
 * Custom hook for managing services state.
 */
export function useServicesState() {
    const [state, dispatch] = useReducer(servicesReducer, initialState);

    const setServices = useCallback((services: Service[]) => {
        dispatch({ type: 'SET_SERVICES', payload: services });
    }, []);

    const addService = useCallback((service: Service) => {
        dispatch({ type: 'ADD_SERVICE', payload: service });
    }, []);

    const updateService = useCallback((service: Service) => {
        dispatch({ type: 'UPDATE_SERVICE', payload: service });
    }, []);

    const deleteService = useCallback((id: string) => {
        dispatch({ type: 'DELETE_SERVICE', payload: id });
    }, []);

    const setSelectedService = useCallback((service: Service | null) => {
        dispatch({ type: 'SET_SELECTED_SERVICE', payload: service });
    }, []);

    const setLoadingService = useCallback((loading: boolean) => {
        dispatch({ type: 'SET_LOADING_SERVICE', payload: loading });
    }, []);

    const setSubmittingService = useCallback((submitting: boolean) => {
        dispatch({ type: 'SET_SUBMITTING_SERVICE', payload: submitting });
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

    const setProjectId = useCallback((projectId: string | null) => {
        dispatch({ type: 'SET_PROJECT_ID', payload: projectId });
    }, []);

    return {
        state,
        setServices,
        addService,
        updateService,
        deleteService,
        setSelectedService,
        setLoadingService,
        setSubmittingService,
        setFilter,
        setLoading,
        setError,
        setProjectId,
    };
}