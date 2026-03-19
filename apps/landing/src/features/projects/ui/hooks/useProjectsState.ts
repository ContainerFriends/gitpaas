import { useReducer, useCallback } from 'react';

import { Project } from '../../domain/models/projects.models';

/**
 * Actions for the projects reducer.
 */
type ProjectsAction =
    | { type: 'LOAD_PROJECTS_REQUEST' }
    | { type: 'SET_PROJECTS'; payload: Project[] }
    | { type: 'ADD_PROJECT'; payload: Project }
    | { type: 'UPDATE_PROJECT'; payload: Project }
    | { type: 'DELETE_PROJECT'; payload: string }
    | { type: 'SET_SELECTED_PROJECT'; payload: Project | null }
    | { type: 'SET_LOADING_PROJECT'; payload: boolean }
    | { type: 'SET_SUBMITTING_PROJECT'; payload: boolean }
    | { type: 'SET_FILTER'; payload: string }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };

/**
 * The state shape for projects management.
 */
interface ProjectsState {
    projects: Project[];
    filter: string;
    loading: boolean;
    error: string | null;
    filteredProjects: Project[];
    selectedProject: Project | null;
    loadingProject: boolean;
    submittingProject: boolean;
}

/**
 * Initial state for projects.
 */
const initialState: ProjectsState = {
    projects: [],
    filter: '',
    loading: false,
    error: null,
    filteredProjects: [],
    selectedProject: null,
    loadingProject: false,
    submittingProject: false,
};

/**
 * Filters projects based on the search term.
 */
function filterProjects(projects: Project[], filter: string): Project[] {
    if (!filter.trim()) return projects;

    const searchTerm = filter.toLowerCase();
    return projects.filter((project) => project.name.toLowerCase().includes(searchTerm));
}

/**
 * Projects reducer function.
 */
function projectsReducer(state: ProjectsState, action: ProjectsAction): ProjectsState {
    switch (action.type) {
        case 'LOAD_PROJECTS_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };

        case 'SET_PROJECTS': {
            const filteredProjects = filterProjects(action.payload, state.filter);
            return {
                ...state,
                projects: action.payload,
                filteredProjects,
                loading: false,
                error: null,
            };
        }

        case 'ADD_PROJECT': {
            const newProjects = [...state.projects, action.payload];
            const filteredProjects = filterProjects(newProjects, state.filter);
            return {
                ...state,
                projects: newProjects,
                filteredProjects,
            };
        }

        case 'UPDATE_PROJECT': {
            const updatedProjects = state.projects.map((project) => (project.id === action.payload.id ? action.payload : project));
            const filteredProjects = filterProjects(updatedProjects, state.filter);
            return {
                ...state,
                projects: updatedProjects,
                filteredProjects,
                selectedProject: state.selectedProject?.id === action.payload.id ? action.payload : state.selectedProject,
            };
        }

        case 'DELETE_PROJECT': {
            const newProjects = state.projects.filter((project) => project.id !== action.payload);
            const filteredProjects = filterProjects(newProjects, state.filter);
            return {
                ...state,
                projects: newProjects,
                filteredProjects,
            };
        }

        case 'SET_FILTER': {
            const filteredProjects = filterProjects(state.projects, action.payload);
            return {
                ...state,
                filter: action.payload,
                filteredProjects,
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
                loading: false,
            };

        case 'SET_SELECTED_PROJECT':
            return {
                ...state,
                selectedProject: action.payload,
            };

        case 'SET_LOADING_PROJECT':
            return {
                ...state,
                loadingProject: action.payload,
            };

        case 'SET_SUBMITTING_PROJECT':
            return {
                ...state,
                submittingProject: action.payload,
            };

        default:
            return state;
    }
}

/**
 * Custom hook for managing projects state.
 * This hook encapsulates the reducer and action creators.
 */
export function useProjectsState() {
    const [state, dispatch] = useReducer(projectsReducer, initialState);

    /**
     * Sets the entire list of projects.
     */
    const setProjects = useCallback((projects: Project[]) => {
        dispatch({ type: 'SET_PROJECTS', payload: projects });
    }, []);

    /**
     * Adds a new project to the list.
     */
    const addProject = useCallback((project: Project) => {
        dispatch({ type: 'ADD_PROJECT', payload: project });
    }, []);

    /**
     * Updates an existing project.
     */
    const updateProject = useCallback((project: Project) => {
        dispatch({ type: 'UPDATE_PROJECT', payload: project });
    }, []);

    /**
     * Sets the selected project.
     */
    const setSelectedProject = useCallback((project: Project | null) => {
        dispatch({ type: 'SET_SELECTED_PROJECT', payload: project });
    }, []);

    /**
     * Sets the loading project state.
     */
    const setLoadingProject = useCallback((loading: boolean) => {
        dispatch({ type: 'SET_LOADING_PROJECT', payload: loading });
    }, []);

    /**
     * Sets the submitting project state.
     */
    const setSubmittingProject = useCallback((submitting: boolean) => {
        dispatch({ type: 'SET_SUBMITTING_PROJECT', payload: submitting });
    }, []);

    /**
     * Deletes a project from the list.
     */
    const deleteProject = useCallback((id: string) => {
        dispatch({ type: 'DELETE_PROJECT', payload: id });
    }, []);

    /**
     * Sets the filter for the projects list.
     */
    const setFilter = useCallback((filter: string) => {
        dispatch({ type: 'SET_FILTER', payload: filter });
    }, []);

    /**
     * Sets the loading state.
     */
    const setLoading = useCallback((loading: boolean) => {
        dispatch({ type: 'SET_LOADING', payload: loading });
    }, []);

    /**
     * Sets an error message.
     */
    const setError = useCallback((error: string | null) => {
        dispatch({ type: 'SET_ERROR', payload: error });
    }, []);

    return {
        state,
        setProjects,
        addProject,
        updateProject,
        deleteProject,
        setSelectedProject,
        setLoadingProject,
        setSubmittingProject,
        setFilter,
        setLoading,
        setError,
    };
}
