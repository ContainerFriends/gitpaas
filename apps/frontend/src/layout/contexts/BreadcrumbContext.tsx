import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';

type BreadcrumbMetadata = Record<string, string>;

interface BreadcrumbContextValue {
    metadata: BreadcrumbMetadata;
    setMetadata: (key: string, value: string) => void;
    clearMetadata: (key: string) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextValue | undefined>(undefined);

/**
 * Provider for breadcrumbs
 */
export function BreadcrumbProvider({ children }: { children: ReactNode }): ReactNode {
    const [metadata, setMetadataState] = useState<BreadcrumbMetadata>({});

    const setMetadata = useCallback((key: string, value: string) => {
        setMetadataState((prev) => ({
            ...prev,
            [key]: value,
        }));
    }, []);

    const clearMetadata = useCallback((key: string) => {
        setMetadataState((prev) => {
            const newMetadata = { ...prev };
            delete newMetadata[key];
            return newMetadata;
        });
    }, []);

    return <BreadcrumbContext.Provider value={{ metadata, setMetadata, clearMetadata }}>{children}</BreadcrumbContext.Provider>;
}

/**
 * Hook to access breadcrumb context
 */
export function useBreadcrumbContext(): BreadcrumbContextValue {
    const context = useContext(BreadcrumbContext);
    if (!context) {
        throw new Error('useBreadcrumbContext must be used within a BreadcrumbProvider');
    }
    return context;
}

/**
 * Hook to register breadcrumb metadata from components
 */
export function useBreadcrumbMetadata(key: string, value: string | undefined): void {
    const { setMetadata, clearMetadata } = useBreadcrumbContext();

    // Update metadata when value changes
    useEffect(() => {
        if (value) {
            setMetadata(key, value);
        }

        // Cleanup on unmount or when key/value changes
        return () => {
            clearMetadata(key);
        };
    }, [key, value, setMetadata, clearMetadata]);
}
