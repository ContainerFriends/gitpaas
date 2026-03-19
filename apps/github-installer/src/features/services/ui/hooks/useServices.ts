import { useContext } from 'react';

import { ServicesContext, ServicesContextValue } from '../context/ServicesContext';

/**
 * Hook to access Services context
 */
export const useServices = (): ServicesContextValue => {
    const context = useContext(ServicesContext);

    if (!context) {
        throw new Error('useServices must be used within a ServicesProvider');
    }

    return context;
};